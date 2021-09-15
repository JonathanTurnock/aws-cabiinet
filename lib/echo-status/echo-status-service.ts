import { Construct, Duration } from "@aws-cdk/core";
import { Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import { Watchful } from "cdk-watchful";
import { FilterPattern, MetricFilter, RetentionDays } from "@aws-cdk/aws-logs";
import { AlarmWidget, ComparisonOperator } from "@aws-cdk/aws-cloudwatch";

export class EchoStatusService extends Construct {
  private readonly nodeJsFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { lambdaDash }: { lambdaDash: Watchful }
  ) {
    super(scope, id);

    this.nodeJsFunction = new NodejsFunction(this, `echo`, {
      runtime: Runtime.NODEJS_14_X,
      logRetention: RetentionDays.ONE_WEEK,
      bundling: {
        minify: true,
      },
    });

    const api = new RestApi(this, `${EchoStatusService.name}_RestApi`, {
      restApiName: `${EchoStatusService.name}_RestApi`,
      description: "Generates Echos the requested Status Code",
    });

    api.root.addMethod("GET", new LambdaIntegration(this.nodeJsFunction));

    this.createStatusCodeAlarm(lambdaDash, 404, 1);
  }

  /**
   * Creates a Metric with accompanying Alarm to flag occurrences of the given status code
   * appearing in the logs over the last 5 min
   *
   * @param lambdaDash {Watchful}
   * @param statusCode {number} Status Code to watch, i.e. 404
   * @param threshold {number} Alarm Threshold i.e. 1 (per 5 min)
   * @private
   */
  private createStatusCodeAlarm(
    lambdaDash: Watchful,
    statusCode: number,
    threshold: number
  ): void {
    const name = `${statusCode}Errors`;

    const notFoundAlarm = new MetricFilter(
      this,
      `${EchoStatusService.name}_${name}_MetricFilter`,
      {
        metricName: name,
        metricNamespace: EchoStatusService.name,
        logGroup: this.nodeJsFunction.logGroup,
        filterPattern: FilterPattern.numberValue(
          "$.statusCode",
          "=",
          statusCode
        ),
        metricValue: "1",
      }
    )
      .metric({
        statistic: "sum",
        period: Duration.minutes(5),
      })
      .createAlarm(this, `${name}_Alarm`, {
        alarmName: `${EchoStatusService.name}_${name}_Alarm`,
        evaluationPeriods: 1,
        threshold,
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      });

    const alarmWidget = new AlarmWidget({
      alarm: notFoundAlarm,
      title: `${EchoStatusService.name}_${name}/5min`,
      leftYAxis: { label: "Success Rate %", showUnits: false },
    });
    lambdaDash.addAlarm(notFoundAlarm);
    lambdaDash.addWidgets(alarmWidget);
  }
}

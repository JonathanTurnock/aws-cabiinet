import { Stack, StackProps, App } from "@aws-cdk/core";
import { EchoStatusService } from "./echo-status/echo-status-service";
import { Watchful } from "cdk-watchful";

export class CabiinetStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Add Cloudwatch Dashboard for Lambdas
    const lambdaDash = new Watchful(this, "watchful");

    new EchoStatusService(this, EchoStatusService.name, { lambdaDash });
  }
}

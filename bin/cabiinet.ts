#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CabiinetStack } from "../lib/cabiinet-stack";

const app = new cdk.App();
new CabiinetStack(app, "CabiinetStack");

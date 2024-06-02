#!/usr/bin/env node
import { StaticSite } from './static-site';
import { App, Stack } from "aws-cdk-lib";

class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string) {
    super(parent, name);

    new StaticSite(this, 'SatlykovStoreWebsite');
  }
}

const app = new App();

new MyStaticSiteStack(app, 'SatlykovStoreWebsite');

app.synth();

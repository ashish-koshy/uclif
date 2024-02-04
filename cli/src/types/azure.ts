export type AzureNodeBuildParameters = {
  nodeVersion: string,
  installParams: string,
  lintParams: string,
  testParams: string,
  buildParams: string,
  workingDirectory: string,
  buildArtifactPath: string,
};

export type AzureNodePackageParameters = {
  packageFeed: string,
  packageOrgName: string,
  packageRegistry: string,
  packageNameSpace: string,
  packagePublishPath: string,
  packagePublishAuthName: string,
  packagePublishAuthToken: string,
};

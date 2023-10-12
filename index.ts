import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


// TEST RESOURCES -- begin ////////////////////////////////////////////////////
// An ECS cluster to deploy fargate service into
const cluster = new aws.ecs.Cluster("clusterTest123", {});
// A private repo to use for the docker images
const repository = new awsx.ecr.Repository("repositoryTest123", {});
// Create and upload an image, uses local Dockerfile
const image = new awsx.ecr.Image("imageTest123", {
    repositoryUrl: repository.url,
    path: ".",
});
// TEST RESOURCES -- end //////////////////////////////////////////////////////



// EXAMPLE CODE -- begin //////////////////////////////////////////////////////
const logGroup = new aws.cloudwatch.LogGroup("logsTest123", {
    retentionInDays: 7,
});

const fargateService = new awsx.ecs.FargateService("fargateServiceTest123", {
    cluster: cluster.arn, // existing ECS Cluster's ARN,
    assignPublicIp: true, // for testing only
    taskDefinitionArgs: {
        logGroup: {
            existing: logGroup
        },
        containers: {
        nginx:   {
                name: "nginx", // required field
                image: image.imageUri, // required field
                memory: 128,
            },
        },
    },
});
// EXAMPLE CODE -- end ////////////////////////////////////////////////////////



export const urn = fargateService.urn
import { ballerinaExtInstance } from "../../core";
import { commands, window } from "vscode";
import { TM_EVENT_RUN_PROJECT_BUILD, CMP_PROJECT_BUILD } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject, getCurrenDirectoryPath, getCurrentBallerinaFile } from "../../utils/project-utils";

export function activateBuildCommand() {
    const reporter = ballerinaExtInstance.telemetryReporter;

    // register run project build handler
    commands.registerCommand('ballerina.project.build', async () => {
        try {
            reporter.sendTelemetryEvent(TM_EVENT_RUN_PROJECT_BUILD, { component: CMP_PROJECT_BUILD });

            const currentProject = await getCurrentBallerinaProject();
            if (currentProject.packageName !== '.') {
                runCommand(currentProject, BALLERINA_COMMANDS.BUILD, currentProject.path!);
            } else {
                runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.BUILD, getCurrentBallerinaFile());
            }

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_PROJECT_BUILD });
            window.showErrorMessage(error);
        }
    });
}
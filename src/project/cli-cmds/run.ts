import { ballerinaExtInstance } from "../../core";
import { commands, window } from "vscode";
import { TM_EVENT_EXECUTE_BALLERINA_RUN, CMP_BALLERINA_RUN } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject, getCurrentBallerinaFile, getCurrenDirectoryPath } from "../../utils/project-utils";

function activateRunCommand() {
    const reporter = ballerinaExtInstance.telemetryReporter;

    // register ballerina run handler
    commands.registerCommand('ballerina.project.run', async () => {
        try {
            reporter.sendTelemetryEvent(TM_EVENT_EXECUTE_BALLERINA_RUN, { component: CMP_BALLERINA_RUN });

            const currentProject = await getCurrentBallerinaProject();
            if (currentProject.packageName !== '.') {
                runCommand(currentProject, BALLERINA_COMMANDS.RUN, currentProject.path!);
            } else {
                runCurrentFile();
            }
        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_BALLERINA_RUN });
            window.showErrorMessage(error);
        }
    });
}

function runCurrentFile() {
    runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.RUN, getCurrentBallerinaFile());
}

export { activateRunCommand };

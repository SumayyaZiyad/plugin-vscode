import { ballerinaExtInstance } from "../../core";
import { commands, window } from "vscode";
import { TM_EVENT_EXECUTE_BALLERINA_DOC, CMP_BALLERINA_DOC } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject } from "../../utils/project-utils";

function activateDocCommand() {
    const reporter = ballerinaExtInstance.telemetryReporter;

    // register ballerina doc handler
    commands.registerCommand('ballerina.project.doc', async () => {
        try {
            reporter.sendTelemetryEvent(TM_EVENT_EXECUTE_BALLERINA_DOC, { component: CMP_BALLERINA_DOC });

            const currentProject = await getCurrentBallerinaProject();
            if (currentProject.packageName === '.') {
                window.showErrorMessage('Open editor does not reside inside a Ballerina project.');
                return;
            }
            runCommand(currentProject, BALLERINA_COMMANDS.DOC, currentProject.path!);

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_BALLERINA_DOC });
            window.showErrorMessage(error);
        }
    });
}

export { activateDocCommand };

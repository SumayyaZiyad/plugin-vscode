import { ballerinaExtInstance } from "../../core";
import { commands, window } from "vscode";
import { TM_EVENT_RUN_PROJECT_TESTS, CMP_PROJECT_TEST_RUNNER } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject, getCurrentBallerinaFile, getCurrenDirectoryPath } from "../../utils/project-utils";

export function activateTestRunner() {
    const reporter = ballerinaExtInstance.telemetryReporter;

    // register run project tests handler
    commands.registerCommand('ballerina.project.test', async () => {
        try {
            reporter.sendTelemetryEvent(TM_EVENT_RUN_PROJECT_TESTS, { component: CMP_PROJECT_TEST_RUNNER });
            // get Ballerina Project path for current Ballerina file
            const currentProject = await getCurrentBallerinaProject();
            if (currentProject.packageName !== '.') {
                runCommand(currentProject, BALLERINA_COMMANDS.TEST, currentProject.path!);
            } else {
                runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.TEST, getCurrentBallerinaFile());
            }

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_PROJECT_TEST_RUNNER });
            window.showErrorMessage(error);
        }
    });
}

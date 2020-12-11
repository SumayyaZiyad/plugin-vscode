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
            if (!currentProject.path) {
                window.showErrorMessage('Open editor does not reside inside a Ballerina project.');
                return;
            }

            const docOptions = [{
                description: "ballerina doc <module-name>",
                label: "Documentation for module",
                id: "doc-module"
            }, {
                description: "ballerina doc --all",
                label: "Documentation for project",
                id: "doc-all"
            }];

            const userSelection = await window.showQuickPick(docOptions, { placeHolder: 'Select a doc option.' });

            if (userSelection!.id === 'doc-module') {
                let moduleName;
                do {
                    moduleName = await window.showInputBox({ placeHolder: 'Enter module name.' });
                } while (!moduleName || moduleName && moduleName.trim().length === 0);
                runCommand(currentProject, BALLERINA_COMMANDS.DOC, moduleName);
            }

            if (userSelection!.id === 'doc-all') {
                runCommand(currentProject, BALLERINA_COMMANDS.DOC, "--all");
            }

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_BALLERINA_DOC });
            window.showErrorMessage(error);
        }
    });
}

export { activateDocCommand };

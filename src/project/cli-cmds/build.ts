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
            if (currentProject.path) {
                const buildOptions = [
                    {
                        description: "ballerina build <balfile>",
                        label: "Build current file",
                        id: "build-file"
                    }, {
                        description: "ballerina build <module-name>",
                        label: "Build module",
                        id: "build-module"
                    }, {
                        description: "ballerina build --all",
                        label: "Build project",
                        id: "build-all"
                    }
                ];

                const userSelection = await window.showQuickPick(buildOptions, { placeHolder: 'Select a build option.' });
                if (userSelection!.id === 'build-file') {
                    runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.BUILD, getCurrentBallerinaFile());
                }

                if (userSelection!.id === 'build-module') {
                    let moduleName;
                    do {
                        moduleName = await window.showInputBox({ placeHolder: 'Enter module name.' });
                    } while (!moduleName || moduleName && moduleName.trim().length === 0);
                    runCommand(currentProject, BALLERINA_COMMANDS.BUILD, moduleName);
                }

                if (userSelection!.id === 'build-all') {
                    runCommand(currentProject, BALLERINA_COMMANDS.BUILD, "--all");
                }
            } else {
                runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.BUILD, getCurrentBallerinaFile());
            }

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_PROJECT_BUILD });
            window.showErrorMessage(error);
        }
    });
}
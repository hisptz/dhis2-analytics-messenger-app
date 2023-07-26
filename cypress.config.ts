import {defineConfig} from "cypress";
import {chromeAllowXSiteCookies, cucumberPreprocessor, networkShim} from "@dhis2/cypress-plugins";

async function setupNodeEvents(on: any, config: any) {
    chromeAllowXSiteCookies(on, config);
    await cucumberPreprocessor(on, config);
    networkShim(on, config);

}

export default defineConfig({
    e2e: {
        projectId: "11qfeu",
        setupNodeEvents,
        baseUrl: "http://localhost:3000",
        specPattern: "cypress/e2e/**/*.feature",
        env: {
            dhis2DataTestPrefix: "dhis2-analytics-messenger",
            networkMode: "live",
            dhis2ApiVersion: "36"
        },
        experimentalInteractiveRunEvents: true
    },
});

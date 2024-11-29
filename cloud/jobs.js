import cron from "node-cron";


Parse.Cloud.define("cleanupCompletedTasks", async (request) => {
    const log = request?.log || console;
    log.info("Starting cleanupCompletedTasks function");

    try {
        const now = new Date();
        const Task = Parse.Object.extend("Tasks");
        const query = new Parse.Query(Task);

        query.equalTo("status", "completed");
        query.lessThan("dueDate", now);

        const tasksToDelete = await query.find({ useMasterKey: true });

        log.info(`Found ${tasksToDelete.length} tasks that are completed and past due.`);

        if (tasksToDelete.length > 0) {
            for (const task of tasksToDelete) {
                await task.destroy({ useMasterKey: true });
            }
            log.info(`Deleted ${tasksToDelete.length} completed tasks that are past due.`);
        } else {
            log.info("No tasks found that are completed and past due.");
        }
    } catch (error) {
        log.error("Error during cleanupCompletedTasks:", error);
        throw error;
    }
});


cron.schedule("*/5 * * * *", async () => {
    try {
        await Parse.Cloud.run("cleanupCompletedTasks", {}, { useMasterKey: true });
        console.log("Scheduled function executed successfully.");
    } catch (error) {
        console.error("Error running scheduled function:", error);
    }
});

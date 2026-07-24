import kafka from "@repo/kafka";
import {prisma} from "@repo/db";

async function main() {
    const producer = kafka.producer();

    await producer.connect();

    while (1) {
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {
                zapRun: {
                    zap: {
                        isActive: true
                    }
                }
            },
            take: 10
        });

        console.log(pendingRows);

        if (pendingRows.length > 0) {
            await producer.send({
                topic: "zap-events",
                messages: pendingRows.map(r => ({
                    value: JSON.stringify({
                        zapRunId: r.zapRunId,
                        stage: 1
                    })
                }))
            });

            await prisma.zapRunOutbox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map(r => r.id)
                    }
                }
            });
        }

        await new Promise(r => setTimeout(r, 3000));
    }
}

main();
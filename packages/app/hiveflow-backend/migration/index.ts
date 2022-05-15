import dump from './db.dump.json'
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const { projects, estimates, people, current_users, equipments, schedule } = dump;

console.log(projects.length, estimates.length, equipments.length)

const prisma = new PrismaClient();

(async () => {

    // const user_names = current_users.map((x) => x.name)
    // const template_users = people.filter((a) => user_names.indexOf(a.name) < 0)

    // console.log({template_users})

    const orgId = "6109254ac84bdb80e6b027e0";

    await Promise.all(projects.map(async (project) => {
        console.log("adding ", project.id)
        await prisma.project.create({
            data: { 
                id: nanoid(),
                displayId: project.id,
                name: project.name || '',
                organisation: orgId,
                startDate: new Date(project.startDate),
                endDate: project.endDate ? new Date(project.endDate) : null,
                status: project.status || 'draft'
            }
        })
    }));

    // await Promise.all(estimates.map(async (estimate) => {
    //     await prisma.estimate.create({
    //         data: {
    //             id: nanoid(),
    //             displayId: estimate.id,
    //             name: estimate.name || estimate.companyName || 'Unnamed',
    //             status: estimate.status,
    //             createdAt: new Date(estimate.date)
    //             price: estimate.price,
    //             organisation: orgId
    //         }
    //     })
    // }))

    // await Promise.all(equipments.map(async (equipment) => {
    //     await prisma.equipment.create({
    //         data: {
    //             id: nanoid(),
    //             displayId: equipment.id,
    //             name: equipment.name,
    //             registration: equipment.registration,
    //             organisation: orgId
    //         }
    //     })
    // }))

    // await Promise.all(schedule.map(async (scheduleItem) => {
    //     await prisma.scheduleItem.create({
    //         data: {
    //             id: scheduleItem.id,
    //             date: new Date(scheduleItem.date),
    //             project: {
    //                 connect: {id: scheduleItem.project.id}
    //             },
    //             people: [] //Map all people to users
    //             equipment: {
    //                 connect: scheduleItem.equipment.map((x) => ({displayId: x.id}))
    //             },
    //             notes: scheduleItem.notes || [],
    //             owner: {
    //                 connect: {id: scheduleItem.owner.id},
    //             },
    //             managers: {
    //                 connect: schedule.managers.map((x) => ({id: x.id}))
    //             }
    //         }
    //     })
    // }))



})();


import {z} from "zod"


export const gatewaySchema = z.object({
    id: z.string({description: "Unique identifier"}),
    name: z.string({description: "Name of the gateway"}),
    whatsappURL: z.string({description: "Whatsapp service URL. Eg. https://domain.name/whatsapp"}).url('Please enter a valid URL'),
    visualizerURL: z.string({description: "DHIS2 visualizer service URL. Eg. https://domain.name/visualizer"}).url('Please enter a valid URL'),
    chatBotURL: z.string({description: "Chat bot URL. Eg. https://domain.name/bot"}).url('Please enter a valid URL')
})


export type Gateway = z.infer<typeof gatewaySchema>

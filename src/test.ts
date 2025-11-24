import { RQuery } from ".";

type guhType = $<Part & {
    $tags: [
        "Agh"
    ]
    $attributes: {
        guh: 1
    }
}>

const guh = RQuery.Path<guhType>("Workspace\\*Part");

guh.GetAttribute("")
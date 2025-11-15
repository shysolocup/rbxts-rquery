import RQuery from ".";

type guh = $<Part & {
    $attributes: {
        guh: 5
    }

    decal: Decal,
    surface: SurfaceGui & {
        img: ImageLabel
    }
}>

const part = RQuery.Path<guh>("Workspace\\Part");
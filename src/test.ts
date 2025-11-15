import RQuery from ".";


type guh = $<Part & {
    baby: Decal,
    surface: SurfaceGui & {
        img: ImageLabel
    }
}>

const part = RQuery.Path<guh>("Workspace\\*Part");

const baby = part?.FindFirstChild("baby")
const label =part?.WaitForChild("surface").FindFirstChild("");
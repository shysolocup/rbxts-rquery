children can be indexed with RQuery using anonymous types and interfaces

```ts
// guh.client.ts

import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;

type Character = $<Model & {
    Humanoid: Humanoid
    Head: Part
    HumanoidRootPart: Part
    ["Left Arm"]: Part
    ["Left Leg"]: Part
    ["Right Arm"]: Part
    ["Right Leg"]: Part
    Torso: Part
}>

const character = player.Character as me;
```

or using named types and interfaces
```ts
// Character.d.ts

interface Character extends Model {
    Humanoid: Humanoid
    Head: Part
    HumanoidRootPart: Part
    ["Left Arm"]: Part
    ["Left Leg"]: Part
    ["Right Arm"]: Part
    ["Right Leg"]: Part
    Torso: Part
}
```
```ts
// guh.client.ts

import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;

const character = player.Character as $<Character>;
```
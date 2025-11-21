
---

<a
    href="https://www.npmjs.com/package/@rbxts/rquery">
    <img 
        src="./assets/RQuery.png" 
        alt="logo"
        style="width:500px"
    />
</a>

<a 
    href="https://www.npmjs.com/package/@rbxts/rquery">
    <img 
        height=22 
        src="https://img.shields.io/npm/v/@rbxts/rquery?style=flat&color=red&logo=npm&logoColor=white" 
        alt="version" 
    />
</a>
<a 
    href="https://www.npmjs.com/package/@rbxts/rquery">
    <img 
        height=22 
        src="https://img.shields.io/npm/dt/@rbxts/rquery?style=flat&color=green&logo=docusign&logoColor=white" 
        alt="downloads" 
    />
</a>
<a href="https://www.npmjs.com/package/roblox-ts">
    <img 
        height=22 
        src="https://img.shields.io/badge/Powered by-Roblox TS-red?style=flat&color=E1182F&logo=roblox&logoColor=E1182F" 
        alt="roblox-ts" 
    />
</a>
<a 
    href="https://github.com/shysolocup/rbxts-rquery/wiki">
    <img 
        height=22 
        src="https://img.shields.io/badge/documentation-blue?style=flat&color=black&logo=github&logoColor=white" 
        alt="documentation" 
    />
</a>
<img 
    height=22 
    src="https://github.com/shysolocup/rbxts-rquery/actions/workflows/publish-shit.yml/badge.svg" 
    alt="publish"
/>

<br>


⚠️ __PLEASE NOTE:__
this package is currently in active development and is far from finished ⚠️ 

<br>

A small feature-rich Roblox-TS package for more helpful types and simpler management of instances, properties, and attributes.

Obviously inspired in some part by [jQuery](https://jquery.com/).

It includes an RQuery namespace for instance creation and management as well as a ton of method overrides under the `$<BaseType>` type.

It's this simple

```console
npm i @rbxts/rquery
```

<img src="./assets/guh.PNG"/>

RQuery combines the already existent methods of [indexing children in Roblox-TS](https://roblox-ts.com/docs/guides/indexing-children) and combines it with type overwrites to get better type prediction and autofill.

it's also <u>*NON-STRICT*</u> meaning you can still use it COMPLETELY normally without any RQuery stuff.

<br>

---

### Better Children Indexing
RQueries override default Roblox-TS instance functions with better typed ones allowing for more type predictions and autofill.

This doesn't change anything but how you write.

```ts
type guh = $<Part & {
    baby: Decal,
    surface: SurfaceGui & {
        img: ImageLabel
    }
}>


const part = RQuery.UnreliablePath<guh>("Workspace\\*Part");


// fully predicts "baby"
part?.FindFirstChild("baby")


// fully predicts "surface" and predicts img
part?.WaitForChild("surface").FindFirstChild("img");
```

you can also use it to define attributes and tags

```ts
type guh = $<Part & {
    baby: Decal,
    surface: SurfaceGui & {
        img: ImageLabel
    },
    $attributes: {
        guh: 5
    },
    $tags: [
        "CoolPart"
    ]
}>

const part = RQuery.UnreliablePath<guh>("Workspace\\*Part");

part?.GetAttribute("guh");

part?.HasTag("CoolPart");
```

and, as said previously, works without using anything from RQuery but the types

```ts
type guh = $<Part & {
    baby: Decal,
    surface: SurfaceGui & {
        img: ImageLabel
    }
}>

const part = Workspace.WaitForChild("Part") as guh;

// also gives full types
part.WaitForChild("surface").FindFirstChild("img")

```

<br>

---

### Instance Management
RQuery has a few tools for improving instance management in projects.

First: `RQuery.Path` and `RQuery.UnreliablePath` which lets you path to an instance through an extremely feature rich system including:
- shorthand names (`Shared\\`, `Server\\`, `Client\\`, `LocalPlayer\\`, `Character\\`, `Gui\\`)
- unique names (`@name`)
- yields (`*name`)
- unique name yields (`*@name`)
- relative (2nd argument)

`RQuery.Path` always gives back `T` so it won't tell you where it can fail good for stuff you know exists on the server

`RQuery.UnreliablePath` gives `T | undefined` and is useful on the client when you don't know if the instance exists

```ts
RQuery.Path("Workspace\\Baseplate\\Texture");
RQuery.Path("@Baseplate");
RQuery.Path("Workspace\\*Baseplate\\*Texture");
RQuery.Path("*Baseplate\\*Texture", Workspace);
RQuery.Path("*@Baseplate\\*Texture");
```

Second: `RQuery.Instantiate` which lets you create instances with complex properties, children, and attributes on the fly.

(also `RQuery.Propertize`)

```ts
// full type predictions for instance names, properties, children, and attributes

const part = RQuery.Instantiate("Part", {
    "Parent": Workspace,

    "Size": new Vector3(1, 1, 1),
    "Transparency": 1,

    "Attributes": {
        guh: 1,
        AGHH: "buh"
    },

    "Tags": [
        "AwesomePart"
    ]

    "Children": [
        RQuery.Instantiate("Decal", {
            "Name": "baby",
            "Texture": "rbxassetid://8088027399"
        })
    ]
})
```

Lastly: `RQuery.New` which lets you create from a class and automatically give it properties

this is mostly useful for things like params (RaycastParams, OverlapParams)

```ts
// also fully type predicted

const params = RQuery.New(RaycastParams, {
    RespectCanCollide: true,
    CollisionGroup: "PlayerPass"
})
```

<br>

---


## Collaborators

<table>
    
  <tr>
    <td align="center">
        <a href="https://github.com/shysolocup">
                <img 
                    src="https://avatars.githubusercontent.com/u/88659700?v=4?s=100" 
                    width="100px;" 
                    alt="me"
                />
                <br/>
                <sub><b>shysolocup</b></sub>
            </a>
        <br/>
    </td>
</tr>
    
      
</table>

<br>

---

<br>

## Disclaimer
this package and the developers behind it are not associated with Roblox, Roblox-TS, or jQuery

<br><br>
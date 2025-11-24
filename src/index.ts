/*
/////////////////////////////////////////////////////////////////////////////////////////////////
 _______    ______                                          
|       \  /      \                                         
| $$$$$$$\|  $$$$$$\ __    __   ______    ______   __    __ 
| $$__| $$| $$  | $$|  \  |  \ /      \  /      \ |  \  |  \
| $$    $$| $$  | $$| $$  | $$|  $$$$$$\|  $$$$$$\| $$  | $$
| $$$$$$$\| $$ _| $$| $$  | $$| $$    $$| $$   \$$| $$  | $$
| $$  | $$| $$/ \ $$| $$__/ $$| $$$$$$$$| $$      | $$__/ $$
| $$  | $$ \$$ $$ $$ \$$    $$ \$$     \| $$       \$$    $$
 \$$   \$$  \$$$$$$\  \$$$$$$   \$$$$$$$ \$$       _\$$$$$$$
                \$$$                              |  \__| $$
                                                   \$$    $$
                                                    \$$$$$$ 
by shysolocup

/////////////////////////////////////////////////////////////////////////////////////////////////
*/         


import Services from "@rbxts/services";
const trim = (x: string): string => x.gsub("^%s+", "")[0].gsub("%s+$", "")[0]


export type RQueryFactory<Base extends RQueryBase> = $<Base>


export namespace RQuery {
	export const Set = <T extends Instance, K extends WritablePropertyNames<T>>(parent: T, key: K, value: T[K]) => parent[key] = value;

	//#region New()
    /**
     * Creates a new instance of a given class with optional properties useful for param instances like `RaycastParams`
	 * 
	 * ***NOTE***:  If you want to use this with `Instance`s use {@link RQuery.Instantiate()} instead
	 * @param classToCreate Class you want to create
     * @param properties Optional properties object
	 * @example
	 * const params = RQuery.New(RaycastParams, {
	 * 		RespectCanCollide: true,
	 * 		CollisionGroup: "PlayerPass"
	 * })
     */
    export const New = <T>(classToCreate: new () => T, properties?: Partial<{ [K in keyof T]: T[K] }>): T => {;
        const inst = new classToCreate();

        if (properties) {
            for (let [k, v] of pairs(properties)) {
                try {
                    (inst as any)[k as string] = v;
                } catch (e) {
                    warn(`RQueryError // Failed to set property ${k} on ${classToCreate}:`, e);
                }
            }
        }  

        return inst;
    }
    //#endregion


    //#region Instantiate()
    /**
     * Makes a cool and simple instance letting you more easily add properties to it and delete it after a short time.
	 * 
	 * ***NOTE***:  This only works for `Instance`s, if you want to create things like `RaycastParams` use {@link RQuery.Create()}.
	 * 
	 * @param instanceName Name of the instance you want to create to create
	 * @param properties Optional properties object letting you define its properties, children, and attributes
	 * @param lifetime Optional lifetime that'll automatically destroy the instance after the time elapses
	 * @example
	 * const guh = RQuery.Instantiate("Part", {
	 * 		Position: new Vector3(1, 1, 1),
	 * 		Size: new Vector3(1, 1, 1),
	 * 		Children: [
	 * 			RQuery.Instantiate("Decal", {
	 * 				Texture: "rbxassetid://8088027399"
	 * 			})
	 * 		]
	 * })
     */
    export const Instantiate = <
		InstanceName extends InstanceNames = InstanceNames,
		T extends CreatableInstances[InstanceName] = CreatableInstances[InstanceName],
		Properties extends RQueryInstanceProperties<T> = RQueryInstanceProperties<T>,
		Return = $<
			T & {
				"$attributes": Properties["Attributes"]
			}
		>
	>(
		instanceName: InstanceName, 
		properties?: Properties, 
		lifetime?: number
	): Return => {
        let inst = new Instance(instanceName);

        if (properties) Propertize(inst as T, properties);
        if (lifetime) Services.Debris.AddItem(inst as T, lifetime);

        return inst as Return;
    }
    //#endregion


    //#region Propertize()
    /**
     * 
     * @param inst {@link Instance} to propertize
     * @param properties properties of {@link inst}
     * @returns the {@link inst} but cooler
     */
    export const Propertize = <T extends Instance>(inst: T, properties: RQueryInstanceProperties<T>): T => {
		for (let [k, v] of pairs(properties)) {
			if (k === "Attributes") {
				for (let [att_k, att_v] of pairs(v as Record<string, AttributeValue>)) {
					inst.SetAttribute(att_k, att_v)
				}
			}
			if (k === "Tags") {
				(v as string[]).forEach( t => inst.AddTag(t) );
			}
			if (k === "Children") {
				(v as Instance[]).forEach( v => v.Parent = inst);
			}
			else {
				try {
					(inst as any)[k as string] = v;
				} catch (e) {
					warn(`RQueryError // Failed to set property ${k} on ${inst.ClassName}:`, e);
				}
			}
		}

        return inst;
    }
    //#endregion


	//#region Path()
	/**
	 * @param parent instance to get from
	 * @example 
	 * // path with each instance separated by "\\"
	 * RQuery.Path("Workspace\\Baseplate\\Texture");
	 *  // using tags you can do unique names
	 * RQuery.Path("@Baseplate");
	 * // using "*" makes it use WaitForChild() (it waits for Baseplate and Texture)
	 * RQuery.Path("Workspace\\*Baseplate\\*Texture");
	 * // the 2nd argument lets you specify the parent to get from
	 * RQuery.Path("*Baseplate\\*Texture", Workspace);
	 * // you can combine wait and unique name into "*@"
	 * RQuery.Path("*@Baseplate\\*Texture")
	 * @returns given type or default {@link Instance}
	 */
	export const Path = <T extends Instance>(path: RQueryDirectory, parent: Instance = game, timeout = 5): T => {
		return UnreliablePath(path, parent, timeout) as T
	}
	//#endregion


	//#region UnreliablePath()
	/**
	 * @param parent instance to get from
	 * @example 
	 * // path with each instance separated by "\\"
	 * RQuery.UnreliablePath("Workspace\\Baseplate\\Texture");
	 *  // using tags you can do unique names
	 * RQuery.UnreliablePath("@Baseplate");
	 * // using "*" makes it use WaitForChild() (it waits for Baseplate and Texture)
	 * RQuery.UnreliablePath("Workspace\\*Baseplate\\*Texture");
	 * // the 2nd argument lets you specify the parent to get from
	 * RQuery.UnreliablePath("*Baseplate\\*Texture", Workspace);
	 * // you can combine wait and unique name into "*@"
	 * RQuery.UnreliablePath("*@Baseplate\\*Texture")
	 * @returns given type or default {@link Instance}
	 */
	export const UnreliablePath = <T extends Instance>(path: RQueryDirectory, parent: Instance = game, timeout = 5): T | undefined => {
		let guh: Instance | undefined = parent;
		let isClient = Services.RunService.IsClient();

		for (let [i, v] of pairs(string.split(path, "\\"))) {
			let fix = trim(v);

			if (fix === "") continue;

			if (i === 1) {
				if (fix === "Shared") fix = "ReplicatedStorage";

				else if (fix === "Server") {
					guh = Services.ServerScriptService.WaitForChild("TS");
					continue;
				}
				else if (fix === "Client") {
					guh = Services.Players.LocalPlayer.WaitForChild("PlayerScripts").WaitForChild("TS");
					continue;
				}
				else if (fix === "LocalPlayer") {
					guh = Services.Players.LocalPlayer;
					continue;
				}
				else if (fix === "Character") {
					let player = Services.Players.LocalPlayer
					guh = player.Character ?? player.CharacterAdded.Wait()[0];
					continue;
				}
				else if (fix === "Gui") {
					guh = Services.Players.LocalPlayer.WaitForChild("PlayerGui");
					continue;
				}
			}

			// *@name is a unique name wait for child
			if (fix.match("^%*@")[0] !== undefined) {
				let name = fix.sub(3);
				let erug: Instance | undefined;
				let elapsed = 0;
				let start = os.clock();


				while (erug === undefined) {
					isClient ? Services.RunService.RenderStepped.Wait() : task.wait();

					elapsed = os.clock() - start;

					if (elapsed >= 5) {
						warn(`Infinite yield possible on @${name} trying to parse on ${path}`);
						print(debug.traceback());
						return;
					}

					erug = Services.CollectionService.GetTagged("UniqueName").filter( a => a.Name === name)[0];
				}

				guh = erug
			}

			// @name is a unique name
			else if (fix.match("^@")[0] !== undefined) {
				let name = fix.sub(2);
				guh = Services.CollectionService.GetTagged("UniqueName").filter( a => a.Name === name)[0];
			}
			else {
				if (guh?.IsA("DataModel")) {
					guh = guh.GetService(fix as keyof Services) as Instance;
				}
				// * is a wait for child
				else if (fix.match("^*")[0] !== undefined) {
					let name = fix.sub(2);
					guh = guh?.WaitForChild(name);
				}
				else {
					guh = guh?.FindFirstChild(fix);
				}
			}
		}

		if (guh) return guh as T;
	}
	//#endregion
}

//#region Helper Types

type nonStrictString = (string & {});

type ServiceName = keyof typeof Services;
export type RQueryDirectory = "@" | "Client\\" | "Server\\" | "Shared\\" | "LocalPlayer\\" | "Character\\" | "Gui\\" | `${ServiceName}\\` | nonStrictString;

type InstanceNames = Extract<keyof CreatableInstances, string>
export type RQueryInstanceProperties<T> = Partial<
	{ [K in keyof T]: T[K] } 
	& 
	{ Children?: Instance[], Attributes?: Record<string, AttributeValue> }
>

//#endregion
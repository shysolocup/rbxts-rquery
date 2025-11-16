import Services from "@rbxts/services";
const trim = (x: string): string => x.gsub("^%s+", "")[0].gsub("%s+$", "")[0]


namespace RQuery {
	export const Set = <T extends Instance, K extends WritablePropertyNames<T>>(parent: T, key: K, value: T[K]) => parent[key] = value;


	/**
	 * Creates a new `Instance` type query
	 */
	export type $<Base extends RQueryBase> = RQueryType<Base>


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
		Properties extends InstanceProperties<T> = InstanceProperties<T>,
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
    export const Propertize = <T extends Instance>(inst: T, properties: InstanceProperties<T>): T => {
		for (let [k, v] of pairs(properties)) {
			if (k === "Attributes") {
				for (let [att_k, att_v] of pairs(v as Record<string, AttributeValue>)) {
					inst.SetAttribute(att_k, att_v)
				}
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
	export const Path = <T extends Instance>(path: Stuff, parent: Instance = game, timeout = 5): T => {
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
	export const UnreliablePath = <T extends Instance>(path: Stuff, parent: Instance = game, timeout = 5): T | undefined => {
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
			if (fix.match("^\*@")[0] !== undefined) {
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

//#region Types

type RQueryType<Base extends RQueryBase> = {

	/**
	 * Base given in creating the query eg: `$<Base>`
	 * 
	 * *This is types only if you try to use it in your code it won't work*
	 */
	$base: Base

	/**
	 * Dictionary of given attributes
	 * 
	 * *This is types only if you try to use it in your code it won't work*
	 */
	$attributes: Record<string, AttributeValue>



	//#region WaitForChild
	/**
	 * Returns the child of the `Instance` with the given name. If the child does not exist, it will yield the current thread until it does.
	 *
	 * - **ThreadSafety**: Unsafe
	 * - **Tags**: CustomLuaState, CanYield
	 *
	 * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#WaitForChild)
	 * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
	 * @param childName The `Instance.Name` to be looked for.
	 * @param timeOut An optional time out parameter.
	 * @returns The `Instance` found.
	 */
	
	WaitForChild: <
		As extends RQueryBase | undefined = undefined, 
		Children extends ExtractKeys<Base, Instance> = never
	>(
		childName: Children | optionalString | number,
		timeOut?: number
	) => iReturnEval<Base, As, Children>

	//#endregion



	//#region FindFirstChild
	/**
	 * Returns the first child of the `Instance` found with the given name.
	 *
	 * - **ThreadSafety**: Safe
	 *
	 * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#FindFirstChild)
	 * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
	 * @param name The `Instance.Name` to be searched for.
	 * @param recursive Whether or not the search should be conducted recursively.
	 * @returns The `Instance` found.
	 */
	
	FindFirstChild: <
		As extends RQueryBase | undefined = undefined, 
		Children extends ExtractKeys<Base, Instance> = never,
	>(
		childName: Children | optionalString | number
	) => iReturnEval<Base, As, Children> | undefined
	
	//#endregion



	//#region GetAttribute
	/**
	 * Returns the value which has been assigned to the given attribute name.
	 *
	 * - **ThreadSafety**: Safe
	 *
	 * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#GetAttribute)
	 * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
	 * @param attribute The name of the attribute being retrieved.
	 * @returns The value which has been assigned to the given attribute name. If no attribute has been assigned, `nil` is returned.
	 */
	
	GetAttribute: <
		As extends RQueryBase | undefined = undefined, 
		Attributes extends keyof Base["$attributes"] = never,
	>(
		attribute: Attributes | optionalString
	) => As extends AttributeValue ? As : Base["$attributes"][Attributes]
	
	//#endregion



	//#region GetAttributes
	/**
	 * Returns the value which has been assigned to the given attribute name.
	 *
	 * - **ThreadSafety**: Safe
	 *
	 * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#GetAttribute)
	 * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
	 * @param attribute The name of the attribute being retrieved.
	 * @returns The value which has been assigned to the given attribute name. If no attribute has been assigned, `nil` is returned.
	 */
	
	GetAttributes: <
		As extends RQueryBase | undefined = undefined,
	>() => As extends AttributeValue ? As : Base["$attributes"]
	
	//#endregion


	
	//#region SetAttribute
	/**
	 * Sets the attribute with the given name to the given value.
	 *
	 * - **ThreadSafety**: Unsafe
	 *
	 * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#SetAttribute)
	 * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
	 * @param attribute The name of the attribute being set.
	 * @param value The value to set the specified attribute to.
	 */
	
	SetAttribute: <
		As extends RQueryBase | undefined = undefined, 
		Attributes extends keyof Base["$attributes"] = never,
	>(
		attribute: Attributes | optionalString,
		value: As extends AttributeValue ? As : Base["$attributes"][Attributes]
	) => void

	//#endregion
} & Base;

type RQueryBase = Instance & {
	$attributes?: Record<string, AttributeValue>
}

/**
 * eval for if it should infer the child's type from `Base`'s properties or use the `As` type
 */
type iReturnEval<
		Base extends Instance, 
		As extends RQueryBase | undefined = undefined, 
		Children extends ExtractKeys<Base, Instance> = ExtractKeys<Base, Instance>
	> = 
	// if o isn't given it defaults to the children
	As extends RQueryType<RQueryBase> ? As
	: As extends Instance ? RQueryType<As>
	: Base[Children] extends RQueryType<RQueryBase> ? Base[Children]
		: Base[Children] extends RQueryBase ? RQueryType<Base[Children]>
		: Instance


/**
 * just an easy way to make it nonstrict, you're welcome
 */
type optionalString = (string & {});

type ServiceName = keyof typeof Services;
type Stuff = "@" | "Client\\" | "Server\\" | "Shared\\" | "LocalPlayer\\" | "Character\\" | "Gui\\" | `${ServiceName}\\` | optionalString;

type InstanceNames = Extract<keyof CreatableInstances, string>
	type InstanceProperties<T> = Partial<
		{ [K in keyof T]: T[K] } 
		& 
		{ Children?: Instance[], Attributes?: Record<string, AttributeValue> }
	>

//#endregion


export = RQuery;
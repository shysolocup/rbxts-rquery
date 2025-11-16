import Services from "@rbxts/services";
declare namespace RQuery {
    export const Set: <T extends Instance, K extends WritablePropertyNames<T>>(parent: T, key: K, value: T[K]) => T[K];
    /**
     * Creates a new `Instance` type query
     */
    type $<Base extends RQueryBase> = {
        /**
         * Base given in creating the query eg: `$<Base>`
         *
         * *This is types only if you try to use it in your code it won't work*
         */
        $base: Base;
        /**
         * Dictionary of given attributes
         *
         * *This is types only if you try to use it in your code it won't work*
         */
        $attributes: Record<string, AttributeValue>;
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
        WaitForChild: <As extends RQueryBase | undefined = undefined, Children extends ExtractKeys<Base, Instance> = never>(childName: Children | optionalString | number, timeOut?: number) => iReturnEval<Base, As, Children>;
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
        FindFirstChild: <As extends RQueryBase | undefined = undefined, Children extends ExtractKeys<Base, Instance> = never>(childName: Children | optionalString | number) => iReturnEval<Base, As, Children> | undefined;
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
        GetAttribute: <As extends RQueryBase | undefined = undefined, Attributes extends keyof Base["$attributes"] = never>(attribute: Attributes | optionalString) => As extends AttributeValue ? As : Base["$attributes"][Attributes];
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
        GetAttributes: <As extends RQueryBase | undefined = undefined>() => As extends AttributeValue ? As : Base["$attributes"];
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
        SetAttribute: <As extends RQueryBase | undefined = undefined, Attributes extends keyof Base["$attributes"] = never>(attribute: Attributes | optionalString, value: As extends AttributeValue ? As : Base["$attributes"][Attributes]) => void;
    } & Base;
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
    export const New: <T>(classToCreate: new () => T, properties?: Partial<{ [K in keyof T]: T[K]; }>) => T;
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
    export const Instantiate: <InstanceName extends InstanceNames = InstanceNames, T extends CreatableInstances[InstanceName] = CreatableInstances[InstanceName], Properties extends InstanceProperties<T> = Partial<{ [K in keyof T]: T[K]; } & {
        Children?: Instance[];
        Attributes?: Record<string, AttributeValue>;
    }>, Return = $<T & {
        $attributes: Properties["Attributes"];
    }>>(instanceName: InstanceName, properties?: Properties, lifetime?: number) => Return;
    /**
     *
     * @param inst {@link Instance} to propertize
     * @param properties properties of {@link inst}
     * @returns the {@link inst} but cooler
     */
    export const Propertize: <T extends Instance>(inst: T, properties: InstanceProperties<T>) => T;
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
    export const Path: <T extends Instance>(path: Stuff, parent?: Instance, timeout?: number) => T;
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
    export const UnreliablePath: <T extends Instance>(path: Stuff, parent?: Instance, timeout?: number) => T | undefined;
    export {};
}
type RQueryBase = Instance & {
    $attributes?: Record<string, AttributeValue>;
};
/**
 * eval for if it should infer the child's type from `Base`'s properties or use the `As` type
 */
type iReturnEval<Base extends Instance, As extends RQueryBase | undefined = undefined, Children extends ExtractKeys<Base, Instance> = ExtractKeys<Base, Instance>> = As extends $<RQueryBase> ? As : As extends Instance ? $<As> : Base[Children] extends $<RQueryBase> ? Base[Children] : Base[Children] extends RQueryBase ? $<Base[Children]> : Instance;
/**
 * just an easy way to make it nonstrict, you're welcome
 */
type optionalString = (string & {});
type ServiceName = keyof typeof Services;
type Stuff = "@" | "Client\\" | "Server\\" | "Shared\\" | "LocalPlayer\\" | "Character\\" | "Gui\\" | `${ServiceName}\\` | optionalString;
type InstanceNames = Extract<keyof CreatableInstances, string>;
type InstanceProperties<T> = Partial<{
    [K in keyof T]: T[K];
} & {
    Children?: Instance[];
    Attributes?: Record<string, AttributeValue>;
}>;
export = RQuery;

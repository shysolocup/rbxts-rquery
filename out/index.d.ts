import Services from "@rbxts/services";
declare namespace RQuery {
    const Set: <T extends Instance, K extends WritablePropertyNames<T>>(parent: T, key: K, value: T[K]) => T[K];
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
    const New: <T>(classToCreate: new () => T, properties?: Partial<{ [K in keyof T]: T[K]; }>) => T;
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
    const Instantiate: <InstanceName extends InstanceNames = InstanceNames, T extends CreatableInstances[InstanceName] = CreatableInstances[InstanceName], Properties extends InstanceProperties<T> = Partial<{ [K in keyof T]: T[K]; } & {
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
    const Propertize: <T extends Instance>(inst: T, properties: InstanceProperties<T>) => T;
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
    const Path: <T extends Instance>(path: Stuff, parent?: Instance, timeout?: number) => T;
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
    const UnreliablePath: <T extends Instance>(path: Stuff, parent?: Instance, timeout?: number) => T | undefined;
}
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

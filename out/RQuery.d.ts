/**
 * Creates a new `Instance` type query
 */
type $<Base extends RQueryBase> = {

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


//#region Types

/**
 * preset for an RQuery
 */

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
    As extends $<RQueryBase> ? As
    : As extends Instance ? $<As>
    : Base[Children] extends $<RQueryBase> ? Base[Children]
        : Base[Children] extends RQueryBase ? $<Base[Children]>
        : Instance


/**
 * just an easy way to make it nonstrict, you're welcome
 */
type optionalString = (string & {});

//#endregion
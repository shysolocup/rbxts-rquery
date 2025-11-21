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


declare const shortener: unique symbol;


// global exporter
declare global {

    //#region Tags

    interface RQueryTagsBase {
        UniqueName: true
    }

    /**
     * list of built in tags able to be overrided from other `d.ts` scripts
     * 
     * note: UniqueName comes with the base tags
     * @example
     * interface RQueryTags extends RQueryTagsBase {
     *      DummyModel: true,
     *      MapPart: true
     * }
     */
    interface RQueryTags extends RQueryTagsBase {}

    //#endregion


    //#region Attributes

    /**
     * dictionary of built in attributes able to be overrided from other `d.ts` scripts
     * 
     * note: UniqueName comes with the base tags
     * @example
     * interface RQueryAttributes {
     *      dying: true,
     *      guh: AGHH
     * }
     */
    interface RQueryAttributes {}

    //#endregion


    //#region $
    /**
     * ## RQuery type factory
     * initiator of an RQuery type
     * 
     * ### `Base`
     * base instance to extend from
     * 
     * allows you to define attributes, tags, and children
     * @example
     * const part = RQuery.UnreliablePath<guh>("Workspace\\*Part");
     * 
     * part?.FindFirstChild("surface")
     * 
     * type guh = $<Part & {
     *      baby: Decal,
     *      surface: SurfaceGui & {
     *          img: ImageLabel
     *      },
     *      $attributes: {
     *          guh: 5
     *      },
     *      $tags: [
	 * 			"AwesomePart"
     *      ]
     * }>
     */ 

    type $<Base extends RQueryBase> = RQueryFactory<Base>;  


    /**
     * preset for an RQuery
     */

    type RQueryBase = Instance & {
        $attributes?: Record<string, AttributeValue>,
        $tags?: ((keyof RQueryTagsBase) | nonStrictString)[]
    }
    
    //#endregion  
}


export * from "./index";


/**
 * Creates a new `Instance` type query
 */
type RQueryFactory<Base extends RQueryBase> = {
    
    [shortener]: never

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


    /**
	 * Array of given tags the instance may have
	 * 
	 * *This is types only if you try to use it in your code it won't work*
	 */
	$tags: string[]



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
		Child extends ExtractKeys<Base, Instance> = never
	>(
		childName: Child | nonStrictString | number,
		timeOut?: number
	) => iReturnEval<Base, As, Child>

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
		Child extends ExtractKeys<Base, Instance> = never,
	>(
		childName: Child | nonStrictString | number
	) => iReturnEval<Base, As, Child> | undefined
	
	//#endregion


    //#region GetChildren
    /**
     * Returns an array containing all of the instance's children.
     *
     * - **ThreadSafety**: Safe
     *
     * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#GetChildren)
     * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
     * @returns An array containing the instance's children.
     */

	GetChildren: <
		Children = ExtractMembers<Base, Instance> & ExtractMembers<Base, $<Instance>>,
	>() => 
        Children[keyof Children][]
	
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
		Attributes extends 
			(keyof RQueryAttributes) 
			| keyof Base["$attributes"] 
			= never,
	>(
		attribute: Attributes | nonStrictString
	) => As extends AttributeValue ? As : (RQueryAttributes & Base["$attributes"])[Attributes]
	
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
	>() => As extends AttributeValue ? As : Base["$attributes"] & RQueryAttributes & { [key: string]: AttributeValue }
	
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
		Attributes extends 
			(keyof RQueryAttributes) 
			| keyof Base["$attributes"] 
			= never,
	>(
		attribute: Attributes | nonStrictString,
		value: As extends AttributeValue ? As : (Base["$attributes"] & RQueryAttributes)[Attributes]
	) => void

	//#endregion


    //#region HasTag
	/**
     * Check whether the instance has a given tag.
     *
     * - **ThreadSafety**: Safe
     *
     * [Creator Hub](https://create.roblox.com/docs/reference/engine/classes/Instance#HasTag)
     * @param this `Instance` is the base class for all classes in the Roblox class hierarchy which can be part of the `DataModel` tree.
     * @param tag
     */

	HasTag: <
		Tags extends 
            (keyof RQueryTags) 
            | Base["$tags"][keyof Base["$tags"]]
            = never,
	>(
		tag: Tags | nonStrictString,
	) => boolean

	//#endregion
	
	//#endregion
} & Base;


//#region Helper Types

type nonStrictString = (string & {});

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

//#endregion
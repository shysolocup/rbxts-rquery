-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local trim = function(x)
	return (string.gsub((string.gsub(x, "^%s+", "")), "%s+$", ""))
end
local RQuery = {}
do
	local _container = RQuery
	local Set = function(parent, key, value)
		parent[key] = value
		return parent[key]
	end
	_container.Set = Set
	--#region New()
	--[[
		*
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
		     
	]]
	local New = function(classToCreate, properties)
		local inst = classToCreate.new()
		if properties ~= 0 and properties == properties and properties ~= "" and properties then
			for k, v in pairs(properties) do
				TS.try(function()
					inst[k] = v
				end, function(e)
					warn(`RQueryError // Failed to set property {k} on {classToCreate}:`, e)
				end)
			end
		end
		return inst
	end
	_container.New = New
	--#endregion
	--#region Instantiate()
	--[[
		*
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
		     
	]]
	local Propertize
	local Instantiate = function(instanceName, properties, lifetime)
		local inst = Instance.new(instanceName)
		if properties then
			Propertize(inst, properties)
		end
		if lifetime ~= 0 and lifetime == lifetime and lifetime then
			Services.Debris:AddItem(inst, lifetime)
		end
		return inst
	end
	_container.Instantiate = Instantiate
	--#endregion
	--#region Propertize()
	--[[
		*
		     * 
		     * @param inst {@link Instance} to propertize
		     * @param properties properties of {@link inst}
		     * @returns the {@link inst} but cooler
		     
	]]
	Propertize = function(inst, properties)
		for k, v in pairs(properties) do
			if k == "Attributes" then
				for att_k, att_v in pairs(v) do
					inst:SetAttribute(att_k, att_v)
				end
			end
			if k == "Children" then
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(v)
					v.Parent = inst
					return v.Parent
				end
				for _k, _v in v do
					_callback(_v, _k - 1, v)
				end
				-- ▲ ReadonlyArray.forEach ▲
			else
				TS.try(function()
					inst[k] = v
				end, function(e)
					warn(`RQueryError // Failed to set property {k} on {inst.ClassName}:`, e)
				end)
			end
		end
		return inst
	end
	_container.Propertize = Propertize
	--#endregion
	--#region Path()
	--[[
		*
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
			 
	]]
	local UnreliablePath
	local Path = function(path, parent, timeout)
		if parent == nil then
			parent = game
		end
		if timeout == nil then
			timeout = 5
		end
		return UnreliablePath(path, parent, timeout)
	end
	_container.Path = Path
	--#endregion
	--#region UnreliablePath()
	--[[
		*
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
			 
	]]
	UnreliablePath = function(path, parent, timeout)
		if parent == nil then
			parent = game
		end
		if timeout == nil then
			timeout = 5
		end
		local guh = parent
		local isClient = Services.RunService:IsClient()
		for i, v in pairs(string.split(path, "\\")) do
			local fix = trim(v)
			if fix == "" then
				continue
			end
			if i == 1 then
				if fix == "Shared" then
					fix = "ReplicatedStorage"
				elseif fix == "Server" then
					guh = Services.ServerScriptService:WaitForChild("TS")
					continue
				elseif fix == "Client" then
					guh = Services.Players.LocalPlayer:WaitForChild("PlayerScripts"):WaitForChild("TS")
					continue
				elseif fix == "LocalPlayer" then
					guh = Services.Players.LocalPlayer
					continue
				elseif fix == "Character" then
					local player = Services.Players.LocalPlayer
					guh = player.Character or (player.CharacterAdded:Wait())
					continue
				elseif fix == "Gui" then
					guh = Services.Players.LocalPlayer:WaitForChild("PlayerGui")
					continue
				end
			end
			-- *@name is a unique name wait for child
			if (string.match(fix, "^\*@")) ~= nil then
				local name = string.sub(fix, 3)
				local erug
				local elapsed = 0
				local start = os.clock()
				while erug == nil do
					if isClient then
						local _ = { Services.RunService.RenderStepped:Wait() }
					else
						task.wait()
					end
					elapsed = os.clock() - start
					if elapsed >= 5 then
						warn(`Infinite yield possible on @{name} trying to parse on {path}`)
						print(debug.traceback())
						return nil
					end
					local _exp = Services.CollectionService:GetTagged("UniqueName")
					-- ▼ ReadonlyArray.filter ▼
					local _newValue = {}
					local _callback = function(a)
						return a.Name == name
					end
					local _length = 0
					for _k, _v in _exp do
						if _callback(_v, _k - 1, _exp) == true then
							_length += 1
							_newValue[_length] = _v
						end
					end
					-- ▲ ReadonlyArray.filter ▲
					erug = _newValue[1]
				end
				guh = erug
			elseif (string.match(fix, "^@")) ~= nil then
				local name = string.sub(fix, 2)
				local _exp = Services.CollectionService:GetTagged("UniqueName")
				-- ▼ ReadonlyArray.filter ▼
				local _newValue = {}
				local _callback = function(a)
					return a.Name == name
				end
				local _length = 0
				for _k, _v in _exp do
					if _callback(_v, _k - 1, _exp) == true then
						_length += 1
						_newValue[_length] = _v
					end
				end
				-- ▲ ReadonlyArray.filter ▲
				guh = _newValue[1]
			else
				local _result = guh
				if _result ~= nil then
					_result = _result:IsA("DataModel")
				end
				if _result then
					guh = guh:GetService(fix)
				elseif (string.match(fix, "^*")) ~= nil then
					local name = string.sub(fix, 2)
					local _result_1 = guh
					if _result_1 ~= nil then
						_result_1 = _result_1:WaitForChild(name)
					end
					guh = _result_1
				else
					local _result_1 = guh
					if _result_1 ~= nil then
						_result_1 = _result_1:FindFirstChild(fix)
					end
					guh = _result_1
				end
			end
		end
		if guh then
			return guh
		end
	end
	_container.UnreliablePath = UnreliablePath
	--#endregion
end
--#region Types
--#endregion
return RQuery

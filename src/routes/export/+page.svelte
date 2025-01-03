<script lang="ts">
	import { rowStore } from '$lib/stores/rowStore';
	import { fetchStatDescriptions } from '$lib/utils/fetchStatDescriptions.js';
	import { fetchVersion } from '$lib/utils/fetchVersion.js';
	import { mockData } from '$lib/utils/mockDataSpark.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let message = 'Export completed!';
	let rowData: any = {};
	let wikitext: string = ''; // Store generated Wikitext
	export let data;
	const gameVersion = data.gameVersion;

	// ✅ Extract datasets dynamically
	const gemTags = data?.allData.GemTags?.rows || [];
	const grantedEffects = data?.allData.GrantedEffects?.rows || [];
	const grantedEffectsStatSetsPerLevel = data?.allData.GrantedEffectStatSetsPerLevel?.rows || [];
	// TODO: do we need this?
	// const grantedEffectsPerLevel = data?.allData.GrantedEffectsPerLevel?.rows || [];

	// Interface for the skill data
	interface ActiveSkillData {
		Id: string;
		DisplayedName: string;
		Description: string;
		GrantedEffect: string;
		Icon_DDSFile: string;
		ActiveSkillTypes: { Id: string; FlagStat?: number | null }[];
		Input_StatKeys: { Id: string; Text?: string }[];
		Output_StatKeys: { Id: string; Text?: string }[];
	}

	function parseDescription(description: string): string {
		if (!description) return '';
		return description
			.replace(/\[.*?\|/g, '') // Remove text inside square brackets before a pipe
			.replace(/[\[\]]/g, '') // Remove any remaining square brackets
			.trim();
	}

  // Function to get the cast time from the granted effect
	function getCastTime(id: string): string {
		const effect = grantedEffects.find((effect) => effect.Id === id);

		// Check if the effect exists
		if (!effect) {
			console.warn(`⚠️ No granted effect found for ID: ${id}`);
			return 'N/A'; // Default fallback if effect is missing
		}

		// Check if CastTime exists and is a valid number
		if (typeof effect.CastTime !== 'number' || isNaN(effect.CastTime)) {
			console.warn(`⚠️ CastTime is missing or invalid for effect ID: ${id}`);
			return 'N/A'; // Default fallback if CastTime is invalid
		}

		// Safely return formatted CastTime
		const castTime = effect.CastTime / 1000;
		return castTime.toFixed(2);
	}

	// ✅ Build a Set of Valid Tags from GemTags
	const validTags = new Set(gemTags.map((tag) => tag.Id));

	// 📑 Step 1: Parse Skill Tags
	function parseGemTags(skillTypes: { Id: string }[]): string {
		return skillTypes
			.filter((type) => validTags.has(type.Id.toLowerCase())) // Normalize to lowercase for comparison
			.map((type) => {
				const gemTag = gemTags.find((gemTag) => gemTag.Id.toLowerCase() === type.Id.toLowerCase());
				// console.log(`Mapping Type: ${type.Id}, Found Tag:`, gemTag.Name);

				if (!gemTag?.Tag) return `${type.Id}`; // Fallback to readable tag if no match

				// Extract text after the pipe if it exists
				const tagText = gemTag.Tag.includes('|')
					? gemTag.Tag.split('|')[1].replace(/[\[\]]/g, '') // Remove square brackets
					: gemTag.Tag.replace(/[\[\]]/g, ''); // Remove square brackets

				return tagText;
			})
			.filter((tag) => tag.trim() !== '') // Remove empty tags
			.join(', ');
	}

	// 🆔 Step 2: Build Metadata ID
	function buildMetadataId(id: string): string {
		return `Metadata/Items/Gem/SkillGem${id.charAt(0).toUpperCase() + id.slice(1)}`;
	}

	// 📊 Step 3: Parse Stat Text
	function parseStatText(stats: { Id: string; Text?: string }[]): string {
		return stats
			.map((stat) => `${stat.Text || stat.Id}`)
			.filter((text) => text.trim() !== '')
			.join('<br>');
	}

	// 📝 Step 4: Parse Skill to Wikitext
	function parseSkillToWikitext(skill: ActiveSkillData): string {
		const gemTags = parseGemTags(skill.ActiveSkillTypes);
		const metadataId = buildMetadataId(skill.Id);
		const statText = parseStatText([...skill.Input_StatKeys, ...skill.Output_StatKeys]);
		const iconPath = skill.Icon_DDSFile.replace('Art/2DArt/', '');
		const cleanDescription = parseDescription(skill.Description);
		const castTime = getCastTime(skill.GrantedEffect);

		return `{{Item
|rarity_id = normal
|name = ${skill.DisplayedName}
|class_id = Active Skill Gem
|size_x = 1
|size_y = 1
|drop_level = 1
|tags = gem, default
|metadata_id = ${metadataId}
|help_text = Skills can be managed in the Skills Panel.
|intelligence_percent = 100
|gem_tags = ${gemTags}
|gem_description = ${cleanDescription}
|skill_id = ${skill.DisplayedName}
|cast_time = ${castTime}
|required_level = 1
|static_cost_types = Mana
|static_critical_strike_chance = 9
|stat_text = ${statText}
|skill_icon = ${iconPath}
|release_version = 0.1.0
|drop_text = It can be obtained by [[Gemcutting|engraving]] an [[Uncut Skill Gem]].
|is_drop_restricted = yes
}}`;
	}

	interface StatBlock {
		stats: string[];
		descriptions: string[];
		values: string[];
	}

	// TODO: handle the `no_desciption` case or just ignore it
	// Parse statDescriptions into blocks
	function parseStatDescriptions(data: string): StatBlock[] {
		const lines = data
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line);
		const blocks: StatBlock[] = [];
		let currentBlock: StatBlock | null = null;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			// 1. Start of a new block
			if (line.startsWith('description')) {
				if (currentBlock) blocks.push(currentBlock); // Save the previous block
				currentBlock = { stats: [], values: [], descriptions: [] };
				continue;
			}

			// 2. Parse Stat (1st line after 'description')
			if (currentBlock && currentBlock.stats.length === 0) {
				currentBlock.stats.push(line);
				continue;
			}

			// 3. Parse Value (2nd line after 'description')
			if (
				currentBlock &&
				currentBlock.stats.length > 0 &&
				currentBlock.values.length === 0 &&
				/^\d+$/.test(line)
			) {
				currentBlock.values.push(line);
				continue;
			}

			// 4. Parse Description Text (remaining lines until next 'description')
			if (currentBlock) {
				currentBlock.descriptions.push(line);
			}
		}

		// Push the last block if it exists
		if (currentBlock) blocks.push(currentBlock);

		return blocks;
	}

	function validateStat(stat: { Id: string; Semantic: number }): boolean {
		// Basic validation using stat properties
		return !!stat.Id && stat.Semantic !== undefined;
	}

	// Replace placeholders in description
	function formatDescription(template: string, values: string[]): string {
		return template.replace(/{(\d+)}/g, (_, index) => values[index] || `{${index}}`).trim();
	}

	function processStats(
		statsArray: { Id: string; Semantic: number }[],
		valuesArray: (string | number)[],
		parsedBlocks: StatBlock[],
		processedStats: Set<string>,
		processedBlocks: Set<string>, // Track processed blocks
		type: 'FloatStat' | 'AdditionalStat'
	) {
		if (!statsArray || statsArray.length === 0) {
			console.warn(`⚠️ No ${type} to process.`);
			return;
		}

		// Clear processed stats for each new set
		processedStats.clear();
		processedBlocks.clear();

		console.log(`🔄 Processing ${type}:`, statsArray);

		statsArray.forEach((stat, index) => {
			const statId = stat.Id.trim();
			if (processedStats.has(statId)) return;

			// Find matching block
			const block = parsedBlocks.find((b) => {
				return b.stats.some((s) => s.includes(statId));
			});

			if (block) {
				// Check if the block was already processed
				const blockKey = block.stats.join('|'); // Unique key for the block

				if (processedBlocks.has(blockKey)) {
					console.warn(`⚠️ Block already processed: "${blockKey}"`);
					return;
				}

				// Ensure we don't mark the block as processed prematurely
				// Only add it after a successful match
				processedStats.add(statId);

				console.log(`✅ Matched ${type} Stats: "${block.stats.join(', ')}"`);
				console.log(`📝 Raw Descriptions:`, block.descriptions);

				// Parse the first stat to see if it has a numeric prefix
				const statMatch = block.stats[0].match(/^(\d+)\s+(.*)/);
				let statCount = 1; // Default to 1 stat if no number prefix

				if (statMatch) {
					statCount = parseInt(statMatch[1], 10); // Extract stat count from prefix
				}

				// Ensure we slice correctly for multi-stat handling
				const relevantStats = block.stats.slice(0, statCount);
				const relevantValues = valuesArray.slice(index, index + statCount);

				console.log('📊 relevantStats:', relevantStats);
				console.log('📊 relevantValues:', relevantValues);

				// Match the description
				let matchedDescription =
					block.descriptions.find((description) => {
						return description.includes('{0}') && description.includes('{1}');
					}) || block.descriptions[0]; // Fallback to the first description

				console.log('📝 Matched Description:', matchedDescription);

				// Ensure placeholders {0} and {1} are correctly replaced
				let formattedDescription = matchedDescription;

				if (matchedDescription.includes('{0}') && matchedDescription.includes('{1}')) {
					formattedDescription = formatDescription(matchedDescription, relevantValues.map(String));
				} else {
					// Fallback to single value replacement if {0} or {1} is missing
					formattedDescription = formatDescription(matchedDescription, [
						valuesArray[index]?.toString() || ''
					]);
				}

				// Apply Semantic formatting
				relevantValues.forEach((value, i) => {
					switch (stat.Semantic) {
						case 1:
							relevantValues[i] = `${value}%`;
							break;
						case 3:
							relevantValues[i] = `${value}`;
							break;
						case 4:
							relevantValues[i] = value === '1' ? 'Enabled' : 'Disabled';
							break;
						default:
							break;
					}
				});

				// Only mark as processed after successful formatting
				processedBlocks.add(blockKey);

				console.log(`📝 Formatted ${type} Description: "${formattedDescription}"`);
			} else {
				console.warn(`❌ No description found for ${type} ID: ${statId}`);
			}
		});
	}

	async function getStatDescriptions(path: string, skillId: string) {
		const { patchUrl } = await fetchVersion(fetch, gameVersion);
		const statDescriptions = await fetchStatDescriptions(fetch, patchUrl, path);

		// Parse descriptions into structured blocks
		const parsedBlocks = parseStatDescriptions(statDescriptions);
		console.log('📦 Parsed Blocks:', parsedBlocks);    

		// Find the relevant stat set for this skill
		const statSet = grantedEffectsStatSetsPerLevel.find((set) => set.StatSet.Id === skillId);

		if (!statSet) {
			console.warn('❌ No StatSet found for skill ID:', skillId);
			return;
		}

		console.log('🔍 Found StatSet:', statSet);
		handleStatsProcessing(statSet, parsedBlocks);
	}

	function handleStatsProcessing(statSet: any, parsedBlocks: StatBlock[]) {
		const processedStats = new Set<string>();
		const processedBlocks = new Set<string>();

		if (statSet?.FloatStats) {
			const validFloatStats = statSet.FloatStats.filter(validateStat);
			processStats(
				validFloatStats,
				statSet.BaseResolvedValues || [],
				parsedBlocks,
				processedStats,
				processedBlocks,
				'FloatStat'
			);
		}

		if (statSet?.AdditionalStats) {
			const validAdditionalStats = statSet.AdditionalStats.filter(validateStat);
			processStats(
				validAdditionalStats,
				statSet.AdditionalStatsValues || [],
				parsedBlocks,
				processedStats,
				processedBlocks,
				'AdditionalStat'
			);
		}
	}

	onMount(async () => {
		// console.log('Available Data:', { gemTags, grantedEffects });

		// Retrieve data from the store
		// TODO: remove mockData
		const storeData = get(rowStore);
		if (!rowStore) {
			console.warn('No row data found in the store.');
			message = 'No data available for export.';
			return;
		}
		// const storeData = mockData;
		console.log('Store Data:', storeData);

		let path = storeData?.StatDescription;
		let skillId = storeData?.GrantedEffect;

    if (skillId && !skillId.includes('Player')) {
      skillId = `${skillId}Player`;
    }


    // TODO: continue here!
		await getStatDescriptions(path, skillId);

		if (storeData) {
			rowData = storeData;
			// console.log('Row data received in /export:', rowData);

			// Transform rowData into ActiveSkillData interface
			const activeSkillData: ActiveSkillData = {
				Id: rowData.Id,
				DisplayedName: rowData.DisplayedName,
				Description: rowData.Description,
				GrantedEffect: rowData.GrantedEffect,
				Icon_DDSFile: rowData.Icon_DDSFile,
				ActiveSkillTypes: rowData.ActiveSkillTypes || [],
				Input_StatKeys: rowData.Input_StatKeys || [],
				Output_StatKeys: rowData.Output_StatKeys || []
			};

			wikitext = parseSkillToWikitext(activeSkillData);
		} else {
			console.warn('No row data found in the store.');
			message = 'No data available for export.';
		}
	});
</script>

<h1>Export Page</h1>
<p>{message}</p>

<h2>Generated Wikitext:</h2>
<pre>{wikitext}</pre>

<script lang="ts">
	import { rowStore } from '$lib/stores/rowStore';
	import { fetchStatDescriptions } from '$lib/utils/fetchStatDescriptions.js';
	import { fetchVersion } from '$lib/utils/fetchVersion.js';
	import { onMount } from 'svelte';

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

	let mockData = {
		Id: 'spark',
		DisplayedName: 'Spark',
		Description:
			'Launches a spray of sparking [Projectile|Projectiles] that travel erratically along the ground until they hit an enemy or expire.',
		ActionType: {
			Id: 'Spark',
			Column_1: 30809,
			Column_2: true,
			Column_3: false,
			Column_4: false,
			Column_5: false
		},
		Icon_DDSFile: 'Art/2DArt/SkillIcons/SorceressSpark.dds',
		ActiveSkillTargetTypes: [1, 2],
		ActiveSkillTypes: [
			{
				Id: 'Spell',
				FlagStat: 424
			},
			{
				Id: 'Projectile',
				FlagStat: 6009
			},
			{
				Id: 'ProjectilesFromUser',
				FlagStat: null
			},
			{
				Id: 'Damage',
				FlagStat: null
			},
			{
				Id: 'Duration',
				FlagStat: null
			},
			{
				Id: 'Trappable',
				FlagStat: null
			},
			{
				Id: 'Totemable',
				FlagStat: null
			},
			{
				Id: 'Mineable',
				FlagStat: null
			},
			{
				Id: 'Multicastable',
				FlagStat: null
			},
			{
				Id: 'Triggerable',
				FlagStat: 8772
			},
			{
				Id: 'Lightning',
				FlagStat: 2684
			},
			{
				Id: 'CanRapidFire',
				FlagStat: null
			},
			{
				Id: 'Invokable',
				FlagStat: 18314
			},
			{
				Id: 'Nonpathing',
				FlagStat: null
			}
		],
		WeaponRestriction_ItemClasses: [],
		WebsiteDescription:
			'Lightning is a fickle servant. However, skilled casters have learned to harness this frenetic element to devastating effect. With a single incantation, two pulsing strands of electric energy appear, and begin to move erratically around the battlefield. Whenever one contacts an enemy, it discharges, dealing tremendous damage and frequently causing paralysis.',
		WebsiteImage: 'http://s3.amazonaws.com/pathofexile/image/skills/intelligence/spark.jpg',
		HideOnWebsite: false,
		GrantedEffect: 'SparkPlayer',
		Column_12: false,
		SkillTotemId: 25,
		IsManuallyCasted: true,
		Input_Stats: [
			{
				Id: 'spark_damage_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 670464211,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_num_of_additional_projectiles',
				Column_1: true,
				IsLocal: true,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 4067285362,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_projectile_speed_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 1666436661,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_num_of_additional_projectiles_in_chain',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 2216266023,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_projectiles_nova',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 1162818849,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_number_of_additional_projectiles',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 3357886255,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_skill_effect_duration_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 1564790257,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'spark_totems_from_this_skill_grant_totemified_lightning_tendrils_larger_pulse_interval_-X_to_parent',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 359226739,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'totemified_spark_skill_effect_duration_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: '',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 4040446272,
				BelongsActiveSkills: [
					'spark',
					'unique_earthbound_triggered_spark',
					'vaal_spark',
					'monster_spark'
				],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			}
		],
		Output_Stats: [
			{
				Id: 'damage_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: 'All Damage',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 3125968493,
				BelongsActiveSkills: [],
				Category: 1,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'number_of_additional_projectiles',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: 'Additional Projectiles',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 2418272691,
				BelongsActiveSkills: [],
				Category: 6,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'base_projectile_speed_+%',
				Column_1: false,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: 'Base Projectile Speed +%',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 3047699552,
				BelongsActiveSkills: [],
				Category: 6,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'number_of_chains',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: 'Additional Chains',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 860057348,
				BelongsActiveSkills: [],
				Category: 18,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'projectiles_nova',
				Column_1: false,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 4,
				Text: '',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 2089528950,
				BelongsActiveSkills: [],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: false,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'number_of_additional_projectiles',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: 'Additional Projectiles',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 2418272691,
				BelongsActiveSkills: [],
				Category: 6,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'skill_effect_duration_+%',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: 'Skill Duration',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 183850661,
				BelongsActiveSkills: [],
				Category: 18,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'totems_from_this_skill_grant_totemified_lightning_tendrils_larger_pulse_interval_-X_to_parent',
				Column_1: true,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 3,
				Text: '',
				Column_6: false,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 2041474159,
				BelongsActiveSkills: [],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			},
			{
				Id: 'totemified_skill_effect_duration_+%',
				Column_1: false,
				IsLocal: false,
				IsWeaponLocal: false,
				Semantic: 1,
				Text: '',
				Column_6: true,
				IsVirtual: false,
				MainHandAlias_Stat: null,
				OffHandAlias_Stat: null,
				Column_10: true,
				HASH32: 312466241,
				BelongsActiveSkills: [],
				Category: null,
				Column_14: false,
				Column_15: false,
				IsScalable: true,
				ContextFlags: [],
				DotFlag: [],
				WeaponHandCheck: false
			}
		],
		MinionActiveSkillTypes: [],
		Column_18: true,
		isGem: true,
		SecondarySkillSpecificStats: [],
		SkillMine: 8,
		AlternateSkillTargetingBehaviour: {
			Id: 'ConsoleAtFeetNormalSelfcast',
			Column_1: 0,
			ClientStrings: 4714,
			Column_3: 5,
			Column_4: 5,
			Column_5: 5,
			Column_6: [0, 3]
		},
		Column_23: false,
		AIFile: '',
		StatContextFlags: [
			{
				Id: 'SpellHit',
				Column_1: 0
			},
			{
				Id: 'HitGeneral',
				Column_1: 0
			},
			{
				Id: 'BaseDamage',
				Column_1: 0
			},
			{
				Id: 'Damage',
				Column_1: 0
			},
			{
				Id: 'DamageFinal',
				Column_1: 0
			},
			{
				Id: 'DamageOverTime',
				Column_1: 0
			},
			{
				Id: 'DotMultiplier',
				Column_1: 0
			},
			{
				Id: 'Leech',
				Column_1: 0
			},
			{
				Id: 'Conversion',
				Column_1: 0
			},
			{
				Id: 'BaseSpellDamage',
				Column_1: 0
			},
			{
				Id: 'SpellDamage',
				Column_1: 0
			},
			{
				Id: 'SpellDamageFinal',
				Column_1: 0
			}
		],
		Column_26: false,
		Column_27: false,
		Column_28: true,
		ShapeShiftForm: null,
		VideoClip: 'Art/Videos/SkillExamples/Spark.bk2',
		CharacterAudioEvent: null,
		AiScript: 'Metadata/Monsters/Companions/AIScripts/Generic.ais',
		MinionType: null,
		Column_34: null,
		Column_35: '',
		Column_36: false,
		StatDescriptionType: 1,
		StatDescription: 'Metadata/StatDescriptions/specific_skill_stat_descriptions/spark/'
	};

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

	// Function to get the granted effect from the ID
	function getCastTime(id: string): string {
		const effect = grantedEffects.find((effect) => effect.Id === id);
		console.log('Index of Effect:', grantedEffects.indexOf(effect));
		// console.log(grantedEffectsPerLevel[grantedEffects.indexOf(effect)]);
		// getGrantedEffectPerLevel(grantedEffects.indexOf(effect));

		if (!effect) return effect.CastTime;
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

	// Parse statDescriptions into blocks
	function parseStatDescriptions(data: string) {
		const lines = data.split('\n').map((line) => line.trim());
		const blocks: { stats: string[]; description: string }[] = [];
		let i = 0;

		while (i < lines.length) {
			if (lines[i] === 'description') {
				i++; // Move to stats line
				const statLine = lines[i].split(' ');
				const statCount = parseInt(statLine[0], 10);
				const stats = statLine.slice(1); // Collect all stat IDs

				i++; // Move to description count
				const descriptionCount = parseInt(lines[i], 10);
				i++; // Move to description lines

				let description = '';
				for (let j = 0; j < descriptionCount; j++) {
					// Handle lines like `#|-1 "{0}% reduced [Projectile] Speed" negate 1`
					if (i < lines.length && /^\d+\|#/.test(lines[i])) {
						const parts = lines[i].split('"');
						if (parts.length > 1) {
							description += parts[1] + ' ';
						}
						i++;
					} else if (i < lines.length && /^\d+\|#\s\d+\s/.test(lines[i])) {
						// Handle lines like `2|# 0 "Fires {0} [Projectile|Projectiles]"`
						const parts = lines[i].split('"');
						if (parts.length > 1) {
							description += parts[1] + ' ';
						}
						i++;
					} else if (i < lines.length && lines[i].startsWith('#')) {
						// Handle traditional `# "Description"` lines
						description += lines[i].replace(/^#*\s*/, '').replace(/^"|"$/g, '') + ' ';
						i++;
					} else {
						break;
					}
				}

				blocks.push({ stats, description: description.trim() });
			} else {
				i++;
			}
		}

		return blocks;
	}

	// Replace placeholders in description
	function formatDescription(template: string, values: string[]): string {
		return template.replace(/{(\d+)}/g, (_, index) => values[index] || `{${index}}`);
	}

	function processStats(
		statsArray: { Id: string }[],
		valuesArray: string[],
		parsedBlocks: { stats: string[]; description: string }[],
		processedStats: Set<string>,
		type: 'FloatStat' | 'AdditionalStat'
	) {
		if (!statsArray || statsArray.length === 0) {
			console.warn(`⚠️ No ${type} to process.`);
			return;
		}

		console.log(`🔄 Processing ${type}:`, statsArray);
		console.log(`🔄 Using Values:`, valuesArray);

		statsArray.forEach((stat, index) => {
			const statId = stat.Id.trim();

			// Skip already processed stats
			if (processedStats.has(statId)) {
				return;
			}

			console.log(`🔍 Searching for COCKS ${type} ID:`, statId);

			// Find matching description block
			const block = parsedBlocks.find((b) => b.stats.includes(statId));

			if (block && block.description.trim() !== '') {
				// Mark all stats in this block as processed
				block.stats.forEach((s) => processedStats.add(s));

				// Replace placeholders with values
				const resolvedValues = valuesArray.length > 0 ? valuesArray : ['N/A'];
				const formattedDescription = formatDescription(block.description, resolvedValues);

				console.log(`✅ Matched ${type} Stats: "${block.stats.join(', ')}"`);
				console.log(`📝 Formatted ${type} Description: "${formattedDescription}"`);
			} else {
				console.warn(`❌ No description found for ${type} ID: ${statId}`);
			}
		});
	}

	async function getStatDescriptions(path: string) {
		const { patchUrl } = await fetchVersion(fetch, gameVersion);
		const statDescriptions = await fetchStatDescriptions(fetch, patchUrl, path);

		// Parse descriptions into structured blocks
		const parsedBlocks = parseStatDescriptions(statDescriptions);
		console.log('📦 Parsed Blocks:', parsedBlocks);

		// Find and format descriptions
		const sparkPlayerStatSet = grantedEffectsStatSetsPerLevel.find(
			(statSet) => statSet.StatSet.Id === 'SparkPlayer'
		);

		if (!sparkPlayerStatSet) {
			console.warn('❌ No StatSet found for SparkPlayer.');
			return;
		}

		console.log('🔍 Found StatSet:', sparkPlayerStatSet);

		const processedStats = new Set<string>(); // Track processed stats to avoid duplicates

		// 📊 Process FloatStats
		processStats(
			sparkPlayerStatSet.FloatStats,
			sparkPlayerStatSet.BaseResolvedValues,
			parsedBlocks,
			processedStats,
			'FloatStat'
		);

		// 📊 Process AdditionalStats
		processStats(
			sparkPlayerStatSet.AdditionalStats,
			sparkPlayerStatSet.AdditionalStatsValues,
			parsedBlocks,
			processedStats,
			'AdditionalStat'
		);
	}

	onMount(async () => {
		// console.log('Available Data:', { gemTags, grantedEffects });

		// Retrieve data from the store
		// TODO: remove mockData
		// const storeData = get(rowStore);
		const storeData = mockData;
		console.log('Store Data:', storeData);

		let path = storeData.StatDescription;

		await getStatDescriptions(path);

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

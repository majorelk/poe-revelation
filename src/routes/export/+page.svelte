<script lang="ts">
	import { rowStore } from '$lib/stores/rowStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let message = 'Export completed!';
	let rowData: any = {};
	let wikitext: string = ''; // Store generated Wikitext
	export let data;

	// ✅ Gem Tags Array
	let gemTags = data.gemTags || [];

	// Interface for the skill data
	interface ActiveSkillData {
		Id: string;
		DisplayedName: string;
		Description: string;
		Icon_DDSFile: string;
		ActiveSkillTypes: { Id: string; FlagStat?: number | null }[];
		Input_StatKeys: { Id: string; Text?: string }[];
		Output_StatKeys: { Id: string; Text?: string }[];
	}

	// ✅ Build a Set of Valid Tags from gemTags
	const validTags = new Set(gemTags.map((tag) => tag.Id));

	// 📑 Step 1: Parse Skill Tags
	function parseGemTags(skillTypes: { Id: string }[]): string {
		console.log('Valid Tags:', validTags);
		console.log('Skill Types:', skillTypes);

		return skillTypes
			.filter((type) => validTags.has(type.Id.toLowerCase())) // Normalize to lowercase for comparison
			.map((type) => {
				const gemTag = gemTags.find((gemTag) => gemTag.Id.toLowerCase() === type.Id.toLowerCase());
				console.log(`Mapping Type: ${type.Id}, Found Tag:`, gemTag);

				if (!gemTag?.Tag) return `[${type.Id}]`; // Fallback to readable tag if no match

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
|gem_description = ${skill.Description}
|skill_id = ${skill.Id}
|cast_time = 0.70
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

	onMount(() => {
		console.log('Available Gem Tags:', gemTags);

		// Retrieve data from the store
		const storeData = get(rowStore);
		if (storeData) {
			rowData = storeData;
			console.log('Row data received in /export:', rowData);

			// Transform rowData into ActiveSkillData interface
			const activeSkillData: ActiveSkillData = {
				Id: rowData.Id,
				DisplayedName: rowData.DisplayedName,
				Description: rowData.Description,
				Icon_DDSFile: rowData.Icon_DDSFile,
				ActiveSkillTypes: rowData.ActiveSkillTypes || [],
				Input_StatKeys: rowData.Input_StatKeys || [],
				Output_StatKeys: rowData.Output_StatKeys || []
			};

			// Generate Wikitext
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

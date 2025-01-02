export let mockData = {
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
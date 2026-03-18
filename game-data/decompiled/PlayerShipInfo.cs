using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Game;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using TheraEngine;

namespace Common.Resources;

public class PlayerShipInfo : XmlAsset<ShipToPlayToken>
{
	public static float Temp_displaySpeedRefactoring = 0.5f;

	public float? Editor_Hp = null;

	public float? Editor_Armor = null;

	public float? Editor_Mobillity = null;

	public float? Editor_Speed = null;

	public readonly ShipStaticInfo StaticInfo;

	public readonly float PatCapacity;

	public readonly int PatPlacesUnits;

	public readonly RTI ShipCostRealBase;

	public readonly PlayerShipCoolness Coolness;

	public readonly int Rank;

	public readonly ShipClass Class;

	private readonly int _007B2357_007D;

	public readonly int MaxIntegrity;

	public readonly Texture2D IconTexture;

	public readonly Texture2D IconTextureWhitespace;

	public readonly Texture2D IconTextureWhitespaceGray;

	public readonly int? MaxMortarPoundage;

	public readonly CannonCategory MaxCannonCategory;

	public readonly int ExtraPlacesForUpgrades;

	public readonly float BattleFarmingBonus;

	public readonly bool CanBeUsedForNpc;

	public readonly int BoardingProtectedGroupsLimit;

	public readonly bool IsSailageLegend;

	public readonly bool RequiredCraftInGuildHavePort;

	public readonly FractionID Fraction = FractionID.None;

	public readonly int PowerupSkillId;

	internal readonly GSI CraftCostDefault;

	internal readonly RTI CraftCostDefaultGold;

	internal readonly GSI CraftCostForIntegrity;

	internal readonly string shipNameKey;

	private readonly string _007B2358_007D;

	private readonly Rectangle _007B2359_007D;

	private readonly string _007B2360_007D;

	private readonly float _007B2361_007D;

	private readonly float _007B2362_007D;

	private readonly float _007B2363_007D;

	private readonly float _007B2364_007D;

	private int? _007B2365_007D;

	public float PatHealth => Editor_Hp ?? _007B2361_007D;

	public float PatArmor => Editor_Armor ?? _007B2362_007D;

	public float PatMobility => Editor_Mobillity ?? _007B2363_007D;

	public float PatSpeed => Editor_Speed ?? _007B2364_007D;

	public string ShipName => Local.Current(shipNameKey);

	public string SubclassName => Local.Current(_007B2358_007D);

	public string Text => Local.Current(_007B2360_007D);

	public bool DisllowedOnArena => base.ID == 65;

	public bool Only1ShipInPb => base.ID == 65;

	public PowerupItemInfo? PowerupSkill => (PowerupSkillId == 0) ? null : Gameplay.PowerupItems[PowerupSkillId];

	public int AssotiatedHazardZoneLevel => _007B2365_007D ?? throw new NullReferenceException();

	public Rectangle IconShipyardTextureInnerRectangle
	{
		get
		{
			//IL_004e: Unknown result type (might be due to invalid IL or missing references)
			//IL_0064: Unknown result type (might be due to invalid IL or missing references)
			//IL_0072: Unknown result type (might be due to invalid IL or missing references)
			//IL_0077: Unknown result type (might be due to invalid IL or missing references)
			//IL_007a: Unknown result type (might be due to invalid IL or missing references)
			int num = Math.Max(_007B2359_007D.Width, _007B2359_007D.Height);
			num = (int)((float)num * 0.8f + 80f);
			if (StaticInfo.IsBalloon)
			{
				num = Math.Max(390, num);
			}
			return new Rectangle(IconTextureWhitespace.Bounds.Width / 2 - num / 2, IconTextureWhitespace.Bounds.Height - num, num, num);
		}
	}

	public Rectangle IconShipyardTextureInnerRectangle2
	{
		get
		{
			//IL_0033: Unknown result type (might be due to invalid IL or missing references)
			//IL_004a: Unknown result type (might be due to invalid IL or missing references)
			//IL_0060: Unknown result type (might be due to invalid IL or missing references)
			//IL_006e: Unknown result type (might be due to invalid IL or missing references)
			//IL_0073: Unknown result type (might be due to invalid IL or missing references)
			//IL_0076: Unknown result type (might be due to invalid IL or missing references)
			int num = Math.Max(_007B2359_007D.Width, _007B2359_007D.Height);
			num = (int)((float)num * 0.6f + 80f);
			num = Math.Min(IconTextureWhitespace.Bounds.Height, num);
			return new Rectangle(IconTextureWhitespace.Bounds.Width / 2 - num / 2, IconTextureWhitespace.Bounds.Height - num, num, num);
		}
	}

	public PlayerShipInfo(ShipToPlayToken _007B2349_007D)
		: base(_007B2349_007D.ID)
	{
		//IL_0486: Unknown result type (might be due to invalid IL or missing references)
		//IL_048b: Unknown result type (might be due to invalid IL or missing references)
		//IL_049c: Unknown result type (might be due to invalid IL or missing references)
		//IL_04a7: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b3: Unknown result type (might be due to invalid IL or missing references)
		//IL_04bd: Expected O, but got Unknown
		//IL_03ff: Unknown result type (might be due to invalid IL or missing references)
		//IL_0404: Unknown result type (might be due to invalid IL or missing references)
		//IL_04d2: Unknown result type (might be due to invalid IL or missing references)
		//IL_04e0: Unknown result type (might be due to invalid IL or missing references)
		//IL_04ee: Unknown result type (might be due to invalid IL or missing references)
		//IL_04fc: Unknown result type (might be due to invalid IL or missing references)
		//IL_050e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0515: Unknown result type (might be due to invalid IL or missing references)
		//IL_0530: Unknown result type (might be due to invalid IL or missing references)
		StaticInfo = Gameplay.ShipsStaticInfo.FromID(_007B2349_007D.StaticInfoID);
		shipNameKey = "ship_" + _007B2349_007D.ID + "_name";
		_007B2360_007D = "ship_" + _007B2349_007D.ID + "_desc";
		string text = Text;
		_007B2361_007D = _007B2349_007D.Health;
		_007B2364_007D = _007B2349_007D.BasicSpeed * 2f;
		_007B2362_007D = _007B2349_007D.Armor;
		PatCapacity = _007B2349_007D.CapacityCg;
		_007B2363_007D = _007B2349_007D.BasicMobility;
		IsSailageLegend = _007B2349_007D.Coolness.Contains("SailageLegend");
		Coolness = Enum.Parse<PlayerShipCoolness>(_007B2349_007D.Coolness.Split(' ')[0]);
		ShipCostRealBase = new RTI(_007B2349_007D.ShipCostReal);
		CanBeUsedForNpc = _007B2349_007D.CanBeUsedForNpc;
		_007B2357_007D = _007B2349_007D.RequiredRank;
		Rank = _007B2349_007D.Rank + 1;
		Class = _007B2349_007D.Type;
		ExtraPlacesForUpgrades = _007B2349_007D.ExtraPlacesForUpgrades;
		_007B2358_007D = _007B2349_007D.Subtype;
		int rank = Rank;
		Fraction = (((uint)(rank - 6) <= 1u) ? FractionID.None : _007B2349_007D.Fraction);
		PowerupSkillId = _007B2349_007D.PowerUpId;
		BattleFarmingBonus = ((_007B2349_007D.ID == 36) ? 0.15f : 0f);
		if (string.IsNullOrEmpty(SubclassName))
		{
			throw new Exception("token.Subtype must be set");
		}
		bool flag = true;
		PatPlacesUnits = (int)MathF.Round(_007B2349_007D.PlacesForUnitsCount * 4f);
		if (base.ID == 62)
		{
			MaxIntegrity = 4;
		}
		else
		{
			MaxIntegrity = ((Coolness == PlayerShipCoolness.Elite && _007B2349_007D.Rank < 5) ? 8 : ((_007B2349_007D.Rank >= 5 && base.ID != 27 && base.ID != 16 && base.ID != 5) ? (-1) : ((_007B2349_007D.Type == ShipClass.Battleship) ? 6 : ((_007B2349_007D.Type == ShipClass.Mortar) ? 6 : 7))));
		}
		if (_007B2349_007D.Rank >= 5 && MaxIntegrity > 0)
		{
			MaxIntegrity--;
		}
		if (_007B2362_007D == 0f)
		{
			throw new InvalidOperationException();
		}
		MaxCannonCategory = (IsCannonsAllowed(CannonCategory.Medium) ? ((!IsCannonsAllowed(CannonCategory.Heavy)) ? CannonCategory.Medium : CannonCategory.Heavy) : CannonCategory.Light);
		MaxMortarPoundage = MortarPoundageMap.GetMortarPoundage(Rank);
		if (Class != ShipClass.Mortar)
		{
			MaxMortarPoundage = Math.Min(7, MaxMortarPoundage ?? 1000);
		}
		if (base.ID == 26)
		{
			MaxMortarPoundage = MortarPoundageMap.GetMortarPoundage(1);
		}
		if (!CommonGlobal.IsServer)
		{
			IconTextureWhitespace = CommonGlobal.CommonDataContent.Load<Texture2D>("_lzcommon\\Items\\Ships\\shipIcon" + StaticInfo.ID);
			IconTextureWhitespaceGray = CommonGlobal.CommonDataContent.Load<Texture2D>("_lzcommon\\Items\\Ships\\shipIcon" + StaticInfo.ID + "_gray");
			Texture2D iconTextureWhitespace = IconTextureWhitespace;
			Color[] array = (Color[])(object)new Color[iconTextureWhitespace.Width * iconTextureWhitespace.Height];
			iconTextureWhitespace.GetData<Color>(array);
			int num = iconTextureWhitespace.Width;
			int num2 = iconTextureWhitespace.Height;
			int num3 = 0;
			int num4 = 0;
			for (int i = 0; i < iconTextureWhitespace.Width; i++)
			{
				for (int j = 0; j < iconTextureWhitespace.Height; j++)
				{
					Color val = array[j * iconTextureWhitespace.Width + i];
					if (((Color)(ref val)).A != 0)
					{
						num = Math.Min(num, i);
						num2 = Math.Min(num2, j);
						num3 = Math.Max(num3, i);
						num4 = Math.Max(num4, j);
					}
				}
			}
			_007B2359_007D = new Rectangle(num, num2, num3 - num, num4 - num2);
			IconTexture = new Texture2D(Engine.GS.graphicsDevice, IconShipyardTextureInnerRectangle2.Width, IconShipyardTextureInnerRectangle2.Height, true, (SurfaceFormat)0);
			Rectangle val2 = default(Rectangle);
			for (int k = 0; k < ((Texture)iconTextureWhitespace).LevelCount; k++)
			{
				int num5 = 1 << k;
				((Rectangle)(ref val2))._002Ector(IconShipyardTextureInnerRectangle2.X / num5, IconShipyardTextureInnerRectangle2.Y / num5, IconShipyardTextureInnerRectangle2.Width / num5, IconShipyardTextureInnerRectangle2.Height / num5);
				int num6 = val2.Width * val2.Height;
				if (num6 == 0)
				{
					break;
				}
				iconTextureWhitespace.GetData<Color>(k, (Rectangle?)val2, array, 0, num6);
				IconTexture.SetData<Color>(k, (Rectangle?)null, array, 0, num6);
			}
		}
		GSI basicShipCraftPrice = Gameplay.GetBasicShipCraftPrice(Coolness, Class, base.ID, Rank - 1, PatHealth, PatArmor, PatCapacity, StaticInfo.Ports.Length, StaticInfo.MortarPorts.Count((CannonLocationInfo _007B2366_007D) => !_007B2366_007D.AvailableWithUpgrade) + StaticInfo.SpecialCannonsCount, PatSpeed, PatMobility);
		RequiredCraftInGuildHavePort = false;
		CraftCostDefaultGold = 0;
		CraftCostForIntegrity = basicShipCraftPrice;
		CraftCostDefault = ((base.ID == 1) ? new GSI() : (StaticInfo.IsBalloon ? basicShipCraftPrice : ((Coolness == PlayerShipCoolness.Default || Coolness == PlayerShipCoolness.Elite) ? basicShipCraftPrice : Gameplay.GetEmpireOrUniqueShipCraftPrice(Coolness, Rank - 1, base.ID))));
		BoardingProtectedGroupsLimit = ((Rank == 1) ? 3 : ((Rank == 2) ? 3 : ((Rank == 3) ? 2 : ((Rank != 4) ? 1 : 2))));
	}

	public (int cost, float discount) GetRealBuyPrice(EventActionsPipelineBase _007B2350_007D)
	{
		float num = _007B2354_007D(_007B2350_007D);
		int num2 = (int)((float)ShipCostRealBase.Value * (1f - num));
		if (num != 0f)
		{
			num2 = (int)MathF.Round(num2 / 5) * 5;
		}
		return (cost: num2, discount: num);
	}

	public (GSI res, RTI gold, float discount) GetCraftPrice(in Decorator _007B2351_007D, EventActionsPipelineBase _007B2352_007D)
	{
		float num = 1f;
		float num2 = 0f;
		if (base.ID == 70)
		{
			GSI gSI = new GSI();
			gSI[72] = 60000;
			return (res: gSI, gold: 0, discount: 0f);
		}
		if (Rank < 6 && Coolness == PlayerShipCoolness.Default)
		{
			num *= 0.9f;
		}
		if (_007B2351_007D.IsInPortOrIsleWithStorage && Coolness == PlayerShipCoolness.Default)
		{
			float num3 = _007B2351_007D.CurrentPortShipCraftDisccount(Rank);
			num *= 1f - num3;
			num2 += num3;
			if (Fraction.IsNation())
			{
				if (!_007B2351_007D.HasCraftShipFractionFine(Fraction))
				{
					num *= 0.9f;
					num2 += 0.2f;
				}
				else
				{
					num *= 1.2f;
				}
			}
		}
		float num4 = _007B2354_007D(_007B2352_007D);
		num *= 1f - num4;
		num2 += num4;
		GSI gSI2 = CraftCostDefault.Clone(num, RoundMode.Round);
		int num5 = (int)((float)CraftCostDefaultGold.Value * num);
		if (Coolness == PlayerShipCoolness.Default)
		{
			gSI2[37] = CraftCostDefault[37];
		}
		return (res: gSI2, gold: num5, discount: num2);
	}

	public (GSI res, int monets) GetDecraft(float _007B2353_007D)
	{
		int item = ((ShipCostRealBase.Value >= 300) ? ((ShipCostRealBase.Value < 1000) ? 50 : ((ShipCostRealBase.Value < 2000) ? 100 : 150)) : 0);
		return (res: Gameplay.GetBasicShipDecraftPrice(CraftCostForIntegrity, _007B2353_007D), monets: item);
	}

	private float _007B2354_007D(EventActionsPipelineBase _007B2355_007D)
	{
		float num = 0f;
		if (CalendarEvents.DiscountAllShips > 0f)
		{
			num = CalendarEvents.DiscountAllShips;
		}
		if (_007B2355_007D == null)
		{
			return num;
		}
		foreach (EventActionBase item in (IEnumerable<EventActionBase>)_007B2355_007D.actions)
		{
			if (item.Behavior is EABehavior1 eABehavior)
			{
				if (eABehavior.Category == EActionCaterory.DiscountBuildingShipClass && eABehavior.ShipClassArgument.Contains(Class))
				{
					num += eABehavior.Amount / 100f;
				}
				if (eABehavior.Category == EActionCaterory.DiscountBuildingShipCoolness && eABehavior.ShipCoolnessArgument == Coolness)
				{
					num += eABehavior.Amount / 100f;
				}
				if (eABehavior.Category == EActionCaterory.DiscountBuildingAllShips)
				{
					num += eABehavior.Amount / 100f;
				}
				if (eABehavior.Category == EActionCaterory.Season_ShipClassBuildingDiscountID && eABehavior.ShipClassSingleArgument == Class && Coolness != PlayerShipCoolness.Empire && Coolness != PlayerShipCoolness.Elite)
				{
					num += eABehavior.Amount / 100f;
				}
			}
		}
		return num;
	}

	public bool IsCannonsAllowed(CannonCategory _007B2356_007D)
	{
		if (_007B2356_007D == CannonCategory.Mortar)
		{
			return true;
		}
		if (base.ID == 3)
		{
			return true;
		}
		int rank = Rank;
		if (1 == 0)
		{
		}
		int num = _007B2356_007D switch
		{
			CannonCategory.Light => 7, 
			CannonCategory.Medium => 4, 
			CannonCategory.Heavy => 2, 
			_ => throw new NotImplementedException(), 
		};
		if (1 == 0)
		{
		}
		return rank <= num;
	}

	internal void PostInit()
	{
		_007B2365_007D = 7 - Rank;
	}

	public override string ToString()
	{
		return ShipName + " | " + (_007B2365_007D ?? (-1)) + " | rank" + Rank;
	}
}

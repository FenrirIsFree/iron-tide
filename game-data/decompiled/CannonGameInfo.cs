using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Common.Data;
using Common.Game;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using TheraEngine;
using TheraEngine.Core;

namespace Common.Resources;

public class CannonGameInfo : XmlAsset<CannonGameInfoToken2>, IStorageAsset
{
	public float? Editor_Penetration = null;

	public float? Editor_Distance = null;

	public float? Editor_ReloadTime = null;

	public float? Editor_Scatter = null;

	public const float firegunOverheatPerGun = 0.08f;

	public const float firegunOverheatResetTime = 25f;

	public readonly ShipCannonCrafting CraftingType;

	public readonly bool NeedsFactoryToCraft;

	public readonly CannonCategory Category;

	public readonly CannonMaterial Material;

	public CraftingRecipe Craft;

	public readonly CannonClass Class;

	public readonly CannonFeature Feature;

	internal string nameKey;

	public readonly float MaxAxis;

	public readonly float MaxAxisDegree;

	public readonly float SplashRadiusMortar;

	private readonly ParameterByRank<int> _007B2248_007D;

	private readonly ParameterByRank<int> _007B2249_007D;

	private readonly ParameterByRank<(int, int)> _007B2250_007D;

	public readonly Texture2D IconTexture;

	public readonly int? Poundage;

	public readonly string Model;

	private readonly float _007B2251_007D;

	private readonly float _007B2252_007D;

	private readonly float _007B2253_007D;

	internal readonly float maxDistance;

	public readonly RTI CostAsGold;

	public readonly int GeneratorCost;

	public readonly bool IsRemoved;

	public string Name => Local.Current(nameKey);

	public float Penetration => Editor_Penetration ?? _007B2251_007D;

	public float MaxDistance => (Editor_Distance ?? maxDistance) * CommonGameConfig.CurrentSettings.ExperimentalCannonBallsDistance;

	public float ReloadTime => Editor_ReloadTime ?? _007B2252_007D;

	public float Scatter => Editor_Scatter ?? _007B2253_007D;

	public bool MortarNeedsPreparation => Class == CannonClass.Mortar && Feature != CannonFeature.Default;

	public bool WorseScatter => Feature == CannonFeature.DoubleShot || Feature == CannonFeature.TripleShot;

	internal int ShotsCount => (Feature == CannonFeature.TripleShot) ? 3 : ((Feature != CannonFeature.DoubleShot) ? 1 : 2);

	float IStorageAsset.getStorageMass => 1f;

	string IStorageAsset.getName => Name;

	Texture2D IStorageAsset.getIconTexture => IconTexture;

	StorageAssetEnum IStorageAsset.getType => StorageAssetEnum.Cannon_DiplayOnly;

	short IStorageAsset.ID => base.ID;

	string IStorageAsset.getDescription => string.Empty;

	public float MortarPreparationTimeMs(PlayerShipInfo _007B2236_007D)
	{
		return (float)ReloadTimeMortar(_007B2236_007D) * 0.14f;
	}

	public int PenetrationMortar(PlayerShipInfo _007B2237_007D)
	{
		return _007B2248_007D[MortarPoundageMap.GetShipRank(_007B2237_007D?.MaxMortarPoundage)];
	}

	public int ReloadTimeMortar(PlayerShipInfo _007B2238_007D)
	{
		return _007B2249_007D[MortarPoundageMap.GetShipRank(_007B2238_007D?.MaxMortarPoundage)];
	}

	public (int, int) DistanceMortar(PlayerShipInfo _007B2239_007D)
	{
		return _007B2250_007D[MortarPoundageMap.GetShipRank(_007B2239_007D?.MaxMortarPoundage)];
	}

	public CannonGameInfo(NpcInfo _007B2240_007D)
		: base(-1)
	{
		_007B2252_007D = (int)(_007B2240_007D.ReloadCannonTime * 1.2f);
		maxDistance = Math.Min(170f, _007B2240_007D.AttackDistance + 20f);
		_007B2253_007D = 15f;
		_007B2251_007D = 13f;
		MaxAxis = _007B2240_007D.MaxCannonAngle;
		nameKey = string.Empty;
		Feature = CannonFeature.Default;
		Class = ((_007B2240_007D.AttackDistance > 130f) ? CannonClass.DistanceCannon : CannonClass.HeavyCannon);
		CannonGameInfo cannonGameInfo = Gameplay.CannonsGameInfo.FindNear(0f, delegate(CannonGameInfo _007B2247_007D)
		{
			return (_007B2247_007D.Class == CannonClass.LiteCannon || _007B2247_007D.Class == CannonClass.DistanceCannon || _007B2247_007D.Class == CannonClass.HeavyCannon) ? (averageDist(maxDistance, _007B2247_007D.maxDistance) + averageDist(_007B2252_007D, _007B2247_007D._007B2252_007D)) : 100f;
			static float averageDist(float _007B2244_007D, float _007B2245_007D)
			{
				return 1f - Math.Min(_007B2244_007D, _007B2245_007D) / Math.Max(_007B2244_007D, _007B2245_007D);
			}
		});
		Model = cannonGameInfo.Model;
		id = cannonGameInfo.ID;
	}

	public CannonGameInfo(ContentManager _007B2241_007D, CannonGameInfoToken2 _007B2242_007D, int _007B2243_007D)
		: base(_007B2243_007D)
	{
		nameKey = ((_007B2242_007D.ID == "removed") ? _007B2242_007D.ID : (_007B2242_007D.ID + "_name"));
		IsRemoved = nameKey == "removed";
		MaxAxis = MathHelper.ToRadians((float)_007B2242_007D.Angle);
		MaxAxisDegree = _007B2242_007D.Angle;
		string[] array = _007B2242_007D.Class.Split(' ');
		Class = (CannonClass)Enum.Parse(typeof(CannonClass), array[0]);
		Feature = (CannonFeature)Enum.Parse(typeof(CannonFeature), array[1]);
		Model = _007B2242_007D.Model;
		IconTexture = _007B2241_007D.Load<Texture2D>("_lzcommon\\Items\\Cannons\\" + _007B2242_007D.Icon);
		CraftingType = (ShipCannonCrafting)Enum.Parse(typeof(ShipCannonCrafting), _007B2242_007D.CraftingType.Split('|').First());
		NeedsFactoryToCraft = _007B2242_007D.Category.Contains("Factory") || (CraftingType == ShipCannonCrafting.ByCraft && Class != CannonClass.Mortar);
		_007B2253_007D = _007B2242_007D.Scatter;
		string[] array2 = _007B2242_007D.Category.Split();
		Category = Enum.Parse<CannonCategory>(array2[0]);
		Material = ((Class != CannonClass.Mortar) ? Enum.Parse<CannonMaterial>(array2[1]) : ((CannonMaterial)(-1)));
		if (Class == CannonClass.Mortar)
		{
			string[] array3 = _007B2242_007D.Extra.Split(new string[3]
			{
				"SplashRadius:",
				Environment.NewLine,
				";"
			}, StringSplitOptions.RemoveEmptyEntries);
			SplashRadiusMortar = int.Parse(array3[0]);
			_007B2252_007D = 1f;
			maxDistance = 1f;
			_007B2251_007D = 1f;
			array3 = _007B2242_007D.Extra.Split(new string[3]
			{
				"SpeedFactor:",
				Environment.NewLine,
				";"
			}, StringSplitOptions.RemoveEmptyEntries);
			_007B2249_007D = new ParameterByRank<int>(_007B2242_007D.Cooldown, (string _007B2254_007D) => int.Parse(_007B2254_007D) * 1000);
			_007B2248_007D = new ParameterByRank<int>(_007B2242_007D.Penetration, (string _007B2255_007D) => int.Parse(_007B2255_007D));
			_007B2250_007D = new ParameterByRank<(int, int)>(_007B2242_007D.Distance, delegate(string _007B2256_007D)
			{
				string[] array4 = _007B2256_007D.Split('-');
				return (int.Parse(array4[0]), int.Parse(array4[1]));
			});
		}
		else
		{
			_007B2252_007D = _007B2242_007D.Cooldown.ParseSafe() * 1000f;
			maxDistance = _007B2242_007D.Distance.ParseSafe();
			_007B2251_007D = _007B2242_007D.Penetration.ParseSafe();
		}
		if (int.TryParse(Regex.Match(Name, "\\d+").Value, out var result))
		{
			Poundage = result;
		}
		Craft = Gameplay.CannonCraftCost(this, _007B2242_007D.Price);
		GeneratorCost = _007B2242_007D.Price;
		CostAsGold = Craft.InputMoney.Value + Craft.InputItems.TotalPrice();
	}

	[CompilerGenerated]
	private float _007B2246_007D(CannonGameInfo _007B2247_007D)
	{
		return (_007B2247_007D.Class == CannonClass.LiteCannon || _007B2247_007D.Class == CannonClass.DistanceCannon || _007B2247_007D.Class == CannonClass.HeavyCannon) ? (averageDist(maxDistance, _007B2247_007D.maxDistance) + averageDist(_007B2252_007D, _007B2247_007D._007B2252_007D)) : 100f;
		static float averageDist(float _007B2244_007D, float _007B2245_007D)
		{
			return 1f - Math.Min(_007B2244_007D, _007B2245_007D) / Math.Max(_007B2244_007D, _007B2245_007D);
		}
	}
}

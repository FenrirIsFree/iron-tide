using Common.Game;

namespace CommonDataTypes;

public class ShipToPlayToken
{
	public int StaticInfoID;

	public int ID;

	public string Coolness;

	public bool CanBeUsedForNpc;

	public int ShipCostReal;

	public string ShipName;

	public float Health;

	public float BasicSpeed;

	public float BasicMobility;

	public float Armor;

	public float CapacityCg;

	public float PlacesForUnitsCount;

	public int Rank;

	public ShipClass Type;

	public string Subtype;

	public int RequiredRank;

	public int ExtraPlacesForUpgrades;

	public FractionID Fraction;

	public int PowerUpId;
}

using System.Linq;

namespace Common.Resources;

public class MortarPoundageMap
{
	public static (int shipRank, int? mortarPundage)[] List = new(int, int?)[7]
	{
		(7, 6),
		(6, 6),
		(5, 7),
		(4, 8),
		(3, 9),
		(2, 10),
		(1, 11)
	};

	public static int? GetMortarPoundage(int _007B2865_007D)
	{
		return List.First(((int shipRank, int? mortarPundage) _007B2867_007D) => _007B2867_007D.shipRank == _007B2865_007D).mortarPundage;
	}

	public static int GetShipRank(int? _007B2866_007D)
	{
		return _007B2866_007D.HasValue ? List.Last(((int shipRank, int? mortarPundage) _007B2868_007D) => _007B2868_007D.mortarPundage == _007B2866_007D).shipRank : 2;
	}
}

using System.Collections.Concurrent;

namespace ManualPacketSerialization.Database;

public class SchemaAccessByKeyField<T>
{
	public MPSKeyFieldInformation<T> info;

	public ConcurrentDictionary<object, uint> keyTable;

	public SchemaAccessByKeyField(MPSKeyFieldInformation<T> _007B11228_007D)
	{
		info = _007B11228_007D;
		keyTable = new ConcurrentDictionary<object, uint>(4, 11012);
	}
}

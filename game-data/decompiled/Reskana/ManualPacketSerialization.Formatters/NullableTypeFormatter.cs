using System.Runtime;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class NullableTypeFormatter
{
	private const byte _null = 0;

	private const byte _value = 1;

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Pack(WriterExtern _007B10935_007D, bool _007B10936_007D)
	{
		_007B10935_007D.WriteByte((!_007B10936_007D) ? ((byte)1) : ((byte)0));
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static bool Unpack(WriterExtern _007B10937_007D)
	{
		return _007B10937_007D.ReadByte() == 1;
	}
}

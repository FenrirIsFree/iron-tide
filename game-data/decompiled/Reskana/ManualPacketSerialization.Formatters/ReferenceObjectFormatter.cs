using System.Runtime;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class ReferenceObjectFormatter
{
	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Pack(WriterExtern _007B10940_007D, IMPSerializable _007B10941_007D)
	{
		if (_007B10941_007D == null)
		{
			NullableTypeFormatter.Pack(_007B10940_007D, _007B10936_007D: true);
			return;
		}
		NullableTypeFormatter.Pack(_007B10940_007D, _007B10936_007D: false);
		_007B10941_007D.Boxing(_007B10940_007D);
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Unpack<T>(WriterExtern _007B10942_007D, out T _007B10943_007D) where T : class, IMPSerializable
	{
		if (NullableTypeFormatter.Unpack(_007B10942_007D))
		{
			ObjectFormatter.Unpack<T>(_007B10942_007D, out _007B10943_007D);
		}
		else
		{
			_007B10943_007D = null;
		}
	}
}

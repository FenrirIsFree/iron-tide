using System.Runtime;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class ReferenceTKObjectFormatter
{
	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Pack(TKWriterExtern _007B10944_007D, ITKSerializable _007B10945_007D)
	{
		if (_007B10945_007D == null)
		{
			NullableTypeFormatter.Pack(_007B10944_007D.writer, _007B10936_007D: true);
			return;
		}
		NullableTypeFormatter.Pack(_007B10944_007D.writer, _007B10936_007D: false);
		TKObjectFormatter.Pack(_007B10944_007D, ref _007B10945_007D);
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Unpack<T>(WriterExtern _007B10946_007D, out T _007B10947_007D) where T : class, ITKSerializable
	{
		if (NullableTypeFormatter.Unpack(_007B10946_007D))
		{
			TKObjectFormatter.Unpack<T>(_007B10946_007D, out _007B10947_007D);
		}
		else
		{
			_007B10947_007D = null;
		}
	}
}

using System.Runtime;
using System.Text;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class StringFormatter
{
	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Pack(WriterExtern _007B10948_007D, string _007B10949_007D, Encoding? _007B10950_007D = null)
	{
		if (string.IsNullOrEmpty(_007B10949_007D))
		{
			NullableTypeFormatter.Pack(_007B10948_007D, _007B10936_007D: true);
			return;
		}
		NullableTypeFormatter.Pack(_007B10948_007D, _007B10936_007D: false);
		if (_007B10950_007D == null)
		{
			_007B10950_007D = Encoding.Unicode;
		}
		int bytes = _007B10950_007D.GetBytes(_007B10949_007D, 0, _007B10949_007D.Length, _007B10948_007D._buffer, _007B10948_007D.Position + 2);
		_007B10948_007D.WriteStruct((short)bytes);
		_007B10948_007D.Position += bytes;
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Unpack(WriterExtern _007B10951_007D, out string _007B10952_007D, Encoding? _007B10953_007D = null)
	{
		if (NullableTypeFormatter.Unpack(_007B10951_007D))
		{
			if (_007B10953_007D == null)
			{
				_007B10953_007D = Encoding.Unicode;
			}
			_007B10951_007D.ReadStruct<short>(out var _007B11041_007D);
			_007B10952_007D = _007B10953_007D.GetString(_007B10951_007D._buffer, _007B10951_007D.Position, _007B11041_007D);
			_007B10951_007D.Position += _007B11041_007D;
		}
		else
		{
			_007B10952_007D = string.Empty;
		}
	}

	private static void QuickAndDirtyAsciiEncode(string _007B10954_007D, byte[] _007B10955_007D)
	{
		int length = _007B10954_007D.Length;
		for (int i = 0; i < length; i++)
		{
			_007B10955_007D[i] = (byte)(_007B10954_007D[i] & 0x7F);
		}
	}
}

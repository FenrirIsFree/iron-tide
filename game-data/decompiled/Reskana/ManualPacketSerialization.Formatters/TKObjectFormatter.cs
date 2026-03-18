using System;
using System.Runtime;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class TKObjectFormatter
{
	private static int k;

	private static bool EnableLog => true;

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public unsafe static void Pack<T>(TKWriterExtern _007B10956_007D, ref T _007B10957_007D) where T : ITKSerializable
	{
		_007B10956_007D.writer.Continue(4);
		int position = _007B10956_007D.writer.Position;
		_007B10957_007D.Boxing(_007B10956_007D);
		int num = _007B10956_007D.writer.Position - position;
		fixed (byte* ptr = &_007B10956_007D.writer._buffer[position - 4])
		{
			*(int*)ptr = num;
		}
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public unsafe static void BeginPackSectionData(TKWriterExtern _007B10958_007D, short _007B10959_007D)
	{
		fixed (byte* ptr = &_007B10958_007D.writer._buffer[_007B10958_007D.writer.Position])
		{
			*(short*)ptr = _007B10959_007D;
		}
		_007B10958_007D.writer.Continue(6);
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public unsafe static void EndPackSectionData(TKWriterExtern _007B10960_007D, int _007B10961_007D)
	{
		int num = _007B10960_007D.writer.Position - _007B10961_007D;
		fixed (byte* ptr = &_007B10960_007D.writer._buffer[_007B10961_007D - 4])
		{
			*(int*)ptr = num;
		}
	}

	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static int Unpack<T>(WriterExtern _007B10962_007D, out T _007B10963_007D) where T : ITKSerializable
	{
		_007B10962_007D.ReadStruct<int>(out var _007B11041_007D);
		int position = _007B10962_007D.Position;
		_007B10963_007D = Activator.CreateInstance<T>();
		_007B10963_007D.PreInit();
		while (_007B10962_007D.Position - position < _007B11041_007D)
		{
			_007B10962_007D.ReadStruct<short>(out var _007B11041_007D2);
			_007B10962_007D.ReadStruct<int>(out var _007B11041_007D3);
			int position2 = _007B10962_007D.Position;
			short _007B10912_007D = _007B11041_007D2;
			_007B10963_007D.Load(_007B10912_007D, _007B10962_007D, out var _007B10914_007D);
			if (!_007B10914_007D)
			{
				_007B10962_007D.Position = position2 + _007B11041_007D3;
			}
			else if (_007B10962_007D.Position - position2 != _007B11041_007D3)
			{
				throw new ArgumentException("DeltaStream access violation field ID: " + _007B11041_007D2 + ", " + typeof(T).Name);
			}
		}
		if (_007B10962_007D.Position - position != _007B11041_007D)
		{
			throw new ArgumentException("DeltaStream access violation");
		}
		_007B10963_007D.PostInit();
		return _007B11041_007D;
	}
}

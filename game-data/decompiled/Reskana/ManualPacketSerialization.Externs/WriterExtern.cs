using System;
using System.Text;
using ManualPacketSerialization.Formatters;

namespace ManualPacketSerialization.Externs;

public class WriterExtern
{
	private const byte _true = byte.MaxValue;

	private const byte _false = 254;

	internal byte[] _buffer;

	internal int inttStartPos;

	public int Position;

	public object? CustomParameter;

	public void Initialize(byte[] _007B11015_007D, int _007B11016_007D)
	{
		_buffer = _007B11015_007D;
		Position = _007B11016_007D;
		inttStartPos = _007B11016_007D;
		CustomParameter = null;
	}

	internal WriterExtern()
	{
	}

	public unsafe void WriteStruct<T>(ref T _007B11017_007D) where T : unmanaged
	{
		fixed (byte* ptr = &_buffer[Position])
		{
			*(T*)ptr = _007B11017_007D;
		}
		Position += sizeof(T);
	}

	public unsafe void WriteStruct<T>(T _007B11018_007D) where T : unmanaged
	{
		fixed (byte* ptr = &_buffer[Position])
		{
			*(T*)ptr = _007B11018_007D;
		}
		Position += sizeof(T);
	}

	public unsafe void WriteStruct<T>(T[] _007B11019_007D, int _007B11020_007D, int _007B11021_007D) where T : unmanaged
	{
		Buffer.BlockCopy(_007B11019_007D, _007B11020_007D * sizeof(T), _buffer, Position, _007B11021_007D * sizeof(T));
		Position += sizeof(T) * _007B11021_007D;
	}

	public void WriteEnum(object _007B11022_007D)
	{
		WriteByte((byte)(int)_007B11022_007D);
	}

	public void WriteByte(byte _007B11023_007D)
	{
		_buffer[Position++] = _007B11023_007D;
	}

	public void RawWriteByte(int _007B11024_007D, byte _007B11025_007D)
	{
		_buffer[Position + _007B11024_007D] = _007B11025_007D;
	}

	public void RawClean(int _007B11026_007D)
	{
		Array.Clear(_buffer, Position, _007B11026_007D);
	}

	public void WriteBytes32bitSize(byte[] _007B11027_007D)
	{
		if (_007B11027_007D == null || _007B11027_007D.Length == 0)
		{
			WriteStruct(0);
			return;
		}
		WriteStruct(_007B11027_007D.Length);
		WriteByteConstSize(_007B11027_007D);
	}

	public void WriteBytes8bitSize(byte[] _007B11028_007D)
	{
		if (_007B11028_007D == null || _007B11028_007D.Length == 0)
		{
			WriteByte(0);
			return;
		}
		WriteByte((byte)_007B11028_007D.Length);
		WriteByteConstSize(_007B11028_007D);
	}

	public void WriteByteConstSize(byte[] _007B11029_007D)
	{
		Buffer.BlockCopy(_007B11029_007D, 0, _buffer, Position, _007B11029_007D.Length);
		Position += _007B11029_007D.Length;
	}

	public void Write(string _007B11030_007D, Encoding? _007B11031_007D = null)
	{
		StringFormatter.Pack(this, _007B11030_007D, _007B11031_007D);
	}

	public void Write(bool _007B11032_007D)
	{
		_buffer[Position++] = (byte)(_007B11032_007D ? byte.MaxValue : 254);
	}

	public void Write<T>(T? _007B11033_007D) where T : class, IMPSerializable
	{
		ReferenceObjectFormatter.Pack(this, _007B11033_007D);
	}

	public void WriteNoNull<T>(T _007B11034_007D) where T : class, IMPSerializable
	{
		_007B11034_007D.Boxing(this);
	}

	public void Write<T>(ref T _007B11035_007D) where T : struct, IMPSerializable
	{
		_007B11035_007D.Boxing(this);
	}

	public void Continue(int _007B11036_007D)
	{
		Position += _007B11036_007D;
	}

	public void GetWriteAmount(out int _007B11037_007D)
	{
		_007B11037_007D = Position - inttStartPos;
	}

	public unsafe void WriteStruct8bitSize<T>(T[] _007B11038_007D, int _007B11039_007D, int _007B11040_007D) where T : unmanaged
	{
		_buffer[Position++] = (byte)_007B11040_007D;
		Buffer.BlockCopy(_007B11038_007D, _007B11039_007D * sizeof(T), _buffer, Position, _007B11040_007D * sizeof(T));
		Position += sizeof(T) * _007B11040_007D;
	}

	public unsafe void ReadStruct<T>(out T _007B11041_007D) where T : unmanaged
	{
		fixed (byte* ptr = &_buffer[Position])
		{
			_007B11041_007D = *(T*)ptr;
		}
		Position += sizeof(T);
	}

	public unsafe void ReadStruct<T>(T[] _007B11042_007D) where T : unmanaged
	{
		Buffer.BlockCopy(_buffer, Position, _007B11042_007D, 0, _007B11042_007D.Length * sizeof(T));
		Position += _007B11042_007D.Length * sizeof(T);
	}

	public void ReadEnum<T>(out T _007B11043_007D) where T : struct
	{
		int num = ReadByte();
		_007B11043_007D = (T)(object)num;
	}

	public void ReadString(out string _007B11044_007D, Encoding? _007B11045_007D = null)
	{
		StringFormatter.Unpack(this, out _007B11044_007D, _007B11045_007D);
	}

	public void ReadBoolean(out bool _007B11046_007D)
	{
		_007B11046_007D = _buffer[Position++] == byte.MaxValue;
	}

	public byte ReadByte()
	{
		return _buffer[Position++];
	}

	public void ReadBytes32bitSize(out byte[] _007B11047_007D)
	{
		ReadStruct<int>(out var _007B11041_007D);
		_007B11047_007D = new byte[_007B11041_007D];
		if (_007B11041_007D != 0)
		{
			Buffer.BlockCopy(_buffer, Position, _007B11047_007D, 0, _007B11041_007D);
			Position += _007B11041_007D;
		}
	}

	public void ReadBytes8bitSize(out byte[] _007B11048_007D)
	{
		byte b = ReadByte();
		_007B11048_007D = new byte[b];
		if (b != 0)
		{
			Buffer.BlockCopy(_buffer, Position, _007B11048_007D, 0, b);
			Position += b;
		}
	}

	public void ReadByte(out byte[] _007B11049_007D, int _007B11050_007D)
	{
		_007B11049_007D = new byte[_007B11050_007D];
		Buffer.BlockCopy(_buffer, Position, _007B11049_007D, 0, _007B11050_007D);
		Position += _007B11050_007D;
	}

	public byte PeekByte()
	{
		return _buffer[Position];
	}

	public unsafe short PeekShort()
	{
		fixed (byte* ptr = &_buffer[Position])
		{
			return *(short*)ptr;
		}
	}

	public void ReadIMPS<T>(out T? _007B11051_007D) where T : class, IMPSerializable
	{
		ReferenceObjectFormatter.Unpack<T>(this, out _007B11051_007D);
	}

	public void ReadIMPSNoNull<T>(out T _007B11052_007D) where T : class, IMPSerializable
	{
		ObjectFormatter.Unpack<T>(this, out _007B11052_007D);
	}

	public void ReadIMPS_struct<T>(out T _007B11053_007D) where T : struct, IMPSerializable
	{
		ObjectFormatter.Unpack<T>(this, out _007B11053_007D);
	}

	public void ReadArray<TItem>(out TItem[] _007B11054_007D, ReadArrayItem<TItem> _007B11055_007D)
	{
		ReadStruct<short>(out var _007B11041_007D);
		_007B11054_007D = new TItem[_007B11041_007D];
		for (int i = 0; i < _007B11041_007D; i++)
		{
			_007B11055_007D(this, out _007B11054_007D[i]);
		}
	}

	public void ReadITKS<T>(out T _007B11056_007D) where T : class, ITKSerializable
	{
		ReferenceTKObjectFormatter.Unpack<T>(this, out _007B11056_007D);
	}

	public void ReadITKS_struct<T>(out T _007B11057_007D) where T : struct, ITKSerializable
	{
		TKObjectFormatter.Unpack<T>(this, out _007B11057_007D);
	}

	public void ReadDynamicTKArray<T>(out T[] _007B11058_007D) where T : class, ITKSerializable
	{
		ReadStruct<short>(out var _007B11041_007D);
		_007B11058_007D = new T[_007B11041_007D];
		for (int i = 0; i < _007B11041_007D; i++)
		{
			ReferenceTKObjectFormatter.Unpack<T>(this, out _007B11058_007D[i]);
		}
	}

	public unsafe void ReadStruct8bitSize<T>(out T[] _007B11059_007D) where T : unmanaged
	{
		_007B11059_007D = new T[_buffer[Position++]];
		Buffer.BlockCopy(_buffer, Position, _007B11059_007D, 0, _007B11059_007D.Length * sizeof(T));
		Position += _007B11059_007D.Length * sizeof(T);
	}

	public void ReadDynamicTKArrayLarge<T>(out T[] _007B11060_007D) where T : class, ITKSerializable
	{
		ReadStruct<int>(out var _007B11041_007D);
		_007B11060_007D = new T[_007B11041_007D];
		for (int i = 0; i < _007B11041_007D; i++)
		{
			ReferenceTKObjectFormatter.Unpack<T>(this, out _007B11060_007D[i]);
		}
	}
}

using System;

namespace ReskanaProgect;

public class MemoryBuffer
{
	private byte[] _007B10744_007D;

	public int Size;

	public int MaxSize = 5242880;

	public byte[] Data => _007B10744_007D;

	public int Capacity => _007B10744_007D.Length;

	public MemoryBuffer()
	{
		_007B10744_007D = new byte[0];
		Size = 0;
	}

	public MemoryBuffer(int _007B10733_007D)
	{
		_007B10744_007D = new byte[_007B10733_007D];
		Size = 0;
	}

	public MemoryBuffer(byte[] _007B10734_007D)
	{
		_007B10744_007D = _007B10734_007D;
		Size = _007B10734_007D.Length;
	}

	public Span<byte> AsSpan()
	{
		return new Span<byte>(_007B10744_007D, 0, Size);
	}

	public void Clear(bool _007B10735_007D = false)
	{
		Size = 0;
		if (_007B10735_007D)
		{
			Array.Clear(_007B10744_007D, 0, Size);
		}
	}

	public void Reserve(int _007B10736_007D)
	{
		if (_007B10736_007D > Capacity)
		{
			if (_007B10736_007D >= MaxSize)
			{
				throw new InvalidOperationException($"Limit of MemoryBuffer is reached - asked for {_007B10736_007D} bytes");
			}
			byte[] dst = new byte[_007B10736_007D + 4096];
			Buffer.BlockCopy(_007B10744_007D, 0, dst, 0, Size);
			_007B10744_007D = dst;
		}
	}

	public void Append(byte[] _007B10737_007D, int _007B10738_007D, int _007B10739_007D)
	{
		Reserve(Size + _007B10739_007D);
		Buffer.BlockCopy(_007B10737_007D, _007B10738_007D, _007B10744_007D, Size, _007B10739_007D);
		Size += _007B10739_007D;
	}

	public void Append(ReadOnlySpan<byte> _007B10740_007D)
	{
		Reserve(Size + _007B10740_007D.Length);
		_007B10740_007D.CopyTo(new Span<byte>(_007B10744_007D, Size, _007B10740_007D.Length));
		Size += _007B10740_007D.Length;
	}

	public int TakeFromStart(int _007B10741_007D, byte[] _007B10742_007D, int _007B10743_007D)
	{
		int num = Math.Min(_007B10741_007D, Size);
		if (num == 0)
		{
			return Size;
		}
		Buffer.BlockCopy(_007B10744_007D, 0, _007B10742_007D, _007B10743_007D, num);
		int num2 = Size - num;
		if (num2 > 0)
		{
			Buffer.BlockCopy(_007B10744_007D, num, _007B10744_007D, 0, num2);
		}
		Size = num2;
		return num2;
	}
}

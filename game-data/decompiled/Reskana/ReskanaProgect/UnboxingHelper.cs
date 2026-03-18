using System;
using System.Runtime.CompilerServices;
using ManualPacketSerialization;

namespace ReskanaProgect;

public class UnboxingHelper
{
	[CompilerGenerated]
	private int _007B10748_007D = 2;

	private byte[] _007B10749_007D;

	private int _007B10750_007D;

	private int _007B10751_007D;

	public int MaxExceedingTheWindow
	{
		[CompilerGenerated]
		get
		{
			return _007B10748_007D;
		}
		[CompilerGenerated]
		set
		{
			_007B10748_007D = value;
		}
	}

	public void Reset()
	{
		_007B10749_007D = null;
		_007B10751_007D = 0;
		_007B10750_007D = 0;
	}

	public UnboxingResult Proceed(IReflectionSource _007B10746_007D, in BufferSegmentStruct _007B10747_007D)
	{
		UnboxingResult _007B10882_007D;
		if (_007B10750_007D > 0)
		{
			if (_007B10750_007D++ >= MaxExceedingTheWindow)
			{
				throw new InvalidOperationException("Failed to fetch packet: lessbytes every time");
			}
			if (_007B10751_007D + _007B10747_007D.StartPosition > _007B10749_007D.Length)
			{
				Array.Resize(ref _007B10749_007D, _007B10749_007D.Length + 20480);
			}
			Buffer.BlockCopy(_007B10747_007D.Buffer, _007B10747_007D.StartPosition, _007B10749_007D, _007B10751_007D, _007B10747_007D.Length);
			_007B10751_007D += _007B10747_007D.Length;
			DeltaStream.Unboxing(_007B10746_007D, _007B10749_007D, _007B10751_007D, 0, out _007B10882_007D, 20480 * MaxExceedingTheWindow < 65535);
		}
		else
		{
			DeltaStream.Unboxing(_007B10746_007D, _007B10747_007D.Buffer, _007B10747_007D.Length, _007B10747_007D.StartPosition, out _007B10882_007D, 20480 * MaxExceedingTheWindow < 65535);
			if (_007B10882_007D.Error == UnboxingError.LessBytes)
			{
				if (_007B10749_007D == null)
				{
					_007B10749_007D = new byte[20480 * MaxExceedingTheWindow];
				}
				Buffer.BlockCopy(_007B10747_007D.Buffer, _007B10747_007D.StartPosition, _007B10749_007D, 0, _007B10747_007D.Length);
				_007B10751_007D = _007B10747_007D.Length;
				_007B10750_007D = 1;
			}
		}
		if (_007B10882_007D.Error == UnboxingError.Success)
		{
			_007B10750_007D = 0;
			_007B10751_007D = 0;
		}
		return _007B10882_007D;
	}
}

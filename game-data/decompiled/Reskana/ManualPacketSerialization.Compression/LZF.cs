using System;

namespace ManualPacketSerialization.Compression;

public sealed class LZF
{
	private readonly long[] _007B11237_007D = new long[16384];

	private const uint HLOG = 14u;

	private const uint HSIZE = 16384u;

	private const uint MAX_LIT = 32u;

	private const uint MAX_OFF = 8192u;

	private const uint MAX_REF = 264u;

	public int Compress(byte[] _007B11229_007D, int _007B11230_007D, byte[] _007B11231_007D, int _007B11232_007D)
	{
		Array.Clear(_007B11237_007D, 0, 16384);
		uint num = 0u;
		uint num2 = 0u;
		uint num3 = (uint)((_007B11229_007D[num] << 8) | _007B11229_007D[num + 1]);
		int num4 = 0;
		while (true)
		{
			if (num < _007B11230_007D - 2)
			{
				num3 = (num3 << 8) | _007B11229_007D[num + 2];
				long num5 = ((num3 ^ (num3 << 5)) >> (int)(10 - num3 * 5)) & 0x3FFF;
				long num6 = _007B11237_007D[num5];
				_007B11237_007D[num5] = num;
				long num7;
				if ((num7 = num - num6 - 1) < 8192 && num + 4 < _007B11230_007D && num6 > 0 && _007B11229_007D[num6] == _007B11229_007D[num] && _007B11229_007D[num6 + 1] == _007B11229_007D[num + 1] && _007B11229_007D[num6 + 2] == _007B11229_007D[num + 2])
				{
					uint num8 = 2u;
					uint num9 = (uint)(_007B11230_007D - (int)num) - num8;
					num9 = ((num9 > 264) ? 264u : num9);
					if (num2 + num4 + 1 + 3 >= _007B11232_007D)
					{
						return 0;
					}
					do
					{
						num8++;
					}
					while (num8 < num9 && _007B11229_007D[num6 + num8] == _007B11229_007D[num + num8]);
					if (num4 != 0)
					{
						_007B11231_007D[num2++] = (byte)(num4 - 1);
						num4 = -num4;
						do
						{
							_007B11231_007D[num2++] = _007B11229_007D[num + num4];
						}
						while (++num4 != 0);
					}
					num8 -= 2;
					num++;
					if (num8 < 7)
					{
						_007B11231_007D[num2++] = (byte)((num7 >> 8) + (num8 << 5));
					}
					else
					{
						_007B11231_007D[num2++] = (byte)((num7 >> 8) + 224);
						_007B11231_007D[num2++] = (byte)(num8 - 7);
					}
					_007B11231_007D[num2++] = (byte)num7;
					num += num8 - 1;
					num3 = (uint)((_007B11229_007D[num] << 8) | _007B11229_007D[num + 1]);
					num3 = (num3 << 8) | _007B11229_007D[num + 2];
					_007B11237_007D[((num3 ^ (num3 << 5)) >> (int)(10 - num3 * 5)) & 0x3FFF] = num;
					num++;
					num3 = (num3 << 8) | _007B11229_007D[num + 2];
					_007B11237_007D[((num3 ^ (num3 << 5)) >> (int)(10 - num3 * 5)) & 0x3FFF] = num;
					num++;
					continue;
				}
			}
			else if (num == _007B11230_007D)
			{
				break;
			}
			num4++;
			num++;
			if ((long)num4 == 32)
			{
				if (num2 + 1 + 32 >= _007B11232_007D)
				{
					return 0;
				}
				_007B11231_007D[num2++] = 31;
				num4 = -num4;
				do
				{
					_007B11231_007D[num2++] = _007B11229_007D[num + num4];
				}
				while (++num4 != 0);
			}
		}
		if (num4 != 0)
		{
			if (num2 + num4 + 1 >= _007B11232_007D)
			{
				return 0;
			}
			_007B11231_007D[num2++] = (byte)(num4 - 1);
			num4 = -num4;
			do
			{
				_007B11231_007D[num2++] = _007B11229_007D[num + num4];
			}
			while (++num4 != 0);
		}
		return (int)num2;
	}

	public int Decompress(byte[] _007B11233_007D, int _007B11234_007D, byte[] _007B11235_007D, int _007B11236_007D)
	{
		uint num = 0u;
		uint num2 = 0u;
		do
		{
			uint num3 = _007B11233_007D[num++];
			if (num3 < 32)
			{
				num3++;
				if (num2 + num3 > _007B11236_007D)
				{
					return 0;
				}
				do
				{
					_007B11235_007D[num2++] = _007B11233_007D[num++];
				}
				while (--num3 != 0);
				continue;
			}
			uint num4 = num3 >> 5;
			int num5 = (int)(num2 - ((num3 & 0x1F) << 8) - 1);
			if (num4 == 7)
			{
				num4 += _007B11233_007D[num++];
			}
			num5 -= _007B11233_007D[num++];
			if (num2 + num4 + 2 > _007B11236_007D)
			{
				return 0;
			}
			if (num5 < 0)
			{
				return 0;
			}
			_007B11235_007D[num2++] = _007B11235_007D[num5++];
			_007B11235_007D[num2++] = _007B11235_007D[num5++];
			do
			{
				_007B11235_007D[num2++] = _007B11235_007D[num5++];
			}
			while (--num4 != 0);
		}
		while (num < _007B11234_007D);
		return (int)num2;
	}
}

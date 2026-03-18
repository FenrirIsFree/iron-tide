using System;
using System.IO;

namespace ManualPacketSerialization.Database;

public class PartitionFileStream : PageFile
{
	private static readonly byte[] completionMarker = new byte[5] { 0, 255, 128, 0, 255 };

	private int _007B11218_007D;

	public PartitionFileStream(int _007B11208_007D, string _007B11209_007D, bool _007B11210_007D)
		: base(_007B11209_007D, _007B11210_007D)
	{
		_007B11218_007D = _007B11208_007D;
	}

	public void WriteData(int _007B11211_007D, byte[] _007B11212_007D, int _007B11213_007D, bool _007B11214_007D)
	{
		int num = _007B11211_007D * _007B11218_007D;
		int num2 = num + _007B11218_007D;
		stream.Seek(num2, SeekOrigin.End);
		stream.Position = num;
		stream.Write(BitConverter.GetBytes(_007B11213_007D), 0, 4);
		stream.Write(_007B11212_007D, 0, _007B11213_007D);
		stream.Write(completionMarker, 0, completionMarker.Length);
		if (_007B11214_007D)
		{
			stream.Flush();
		}
		if (usingBackupSystem)
		{
			backupFile.Seek(num2, SeekOrigin.End);
			backupFile.Position = num;
			backupFile.Write(BitConverter.GetBytes(_007B11213_007D), 0, 4);
			backupFile.Write(_007B11212_007D, 0, _007B11213_007D);
			backupFile.Write(completionMarker, 0, completionMarker.Length);
			if (_007B11214_007D)
			{
				backupFile.Flush();
			}
		}
	}

	public bool ReadData(int _007B11215_007D, byte[] _007B11216_007D, out int _007B11217_007D)
	{
		int num = _007B11215_007D * _007B11218_007D;
		try
		{
			stream.Position = num;
			byte[] array = new byte[4];
			stream.Read(array, 0, 4);
			_007B11217_007D = BitConverter.ToInt32(array, 0);
			stream.Read(_007B11216_007D, 0, _007B11217_007D);
			byte[] array2 = new byte[completionMarker.Length];
			stream.Read(array2, 0, completionMarker.Length);
			for (int i = 0; i < completionMarker.Length; i++)
			{
				if (completionMarker[i] == array2[i])
				{
					continue;
				}
				backupFile.Position = num;
				backupFile.Read(array, 0, 4);
				_007B11217_007D = BitConverter.ToInt32(array, 0);
				backupFile.Read(_007B11216_007D, 0, _007B11217_007D);
				backupFile.Read(array2, 0, completionMarker.Length);
				for (int j = 0; j < completionMarker.Length; j++)
				{
					if (completionMarker[j] != array2[j])
					{
						return false;
					}
				}
				return true;
			}
		}
		catch (Exception)
		{
			_007B11217_007D = 0;
			return false;
		}
		return true;
	}
}

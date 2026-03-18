using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace ManualPacketSerialization.Database;

public class MultiPartitionFileSet
{
	private PartitionFileStream[] _007B11191_007D;

	private object[] _007B11192_007D;

	private int _007B11193_007D;

	private int _007B11194_007D;

	private string _007B11195_007D;

	private object _007B11196_007D = new object();

	private int _007B11197_007D;

	private bool _007B11198_007D;

	public MultiPartitionFileSet(int _007B11176_007D, int _007B11177_007D, string _007B11178_007D, bool _007B11179_007D)
	{
		_007B11193_007D = _007B11177_007D;
		_007B11194_007D = _007B11176_007D;
		_007B11195_007D = _007B11178_007D;
		_007B11198_007D = _007B11179_007D;
		if (File.Exists(_007B11178_007D + "_1"))
		{
			string fileNameOnly = Path.GetFileName(_007B11178_007D);
			List<FileInfo> list = (from _007B11199_007D in new DirectoryInfo(Path.GetDirectoryName(_007B11178_007D)).GetFiles()
				where _007B11199_007D.Name.Contains(fileNameOnly) && !_007B11199_007D.Name.Contains("_backup")
				select _007B11199_007D).ToList();
			_007B11191_007D = new PartitionFileStream[list.Count];
			_007B11192_007D = new object[list.Count];
			for (int num = 0; num < list.Count; num++)
			{
				_007B11191_007D[num] = new PartitionFileStream(_007B11176_007D, list[num].FullName, _007B11179_007D);
				_007B11192_007D[num] = new object();
			}
			_007B11197_007D = _007B11191_007D.Length;
		}
		else
		{
			_007B11192_007D = new object[0];
			_007B11191_007D = new PartitionFileStream[0];
			_007B11180_007D(4);
		}
	}

	public void AcquireLock()
	{
		for (int i = 0; i < _007B11192_007D.Length; i++)
		{
			Monitor.Enter(_007B11192_007D[i]);
		}
	}

	public void AcquireUnlock()
	{
		for (int i = 0; i < _007B11192_007D.Length; i++)
		{
			Monitor.Exit(_007B11192_007D[i]);
		}
	}

	private void _007B11180_007D(int _007B11181_007D)
	{
		lock (_007B11196_007D)
		{
			if (_007B11181_007D <= _007B11197_007D)
			{
				return;
			}
		}
		AcquireLock();
		_007B11197_007D = _007B11181_007D;
		List<object> list = _007B11192_007D.ToList();
		int num = _007B11191_007D.Length;
		int num2 = _007B11181_007D - _007B11191_007D.Length;
		Array.Resize(ref _007B11191_007D, _007B11181_007D);
		Array.Resize(ref _007B11192_007D, _007B11181_007D);
		for (int i = 0; i < num2; i++)
		{
			_007B11191_007D[num + i] = new PartitionFileStream(_007B11194_007D, _007B11195_007D + "_" + (num + i + 1), _007B11198_007D);
			_007B11192_007D[num + i] = new object();
		}
		for (int j = 0; j < list.Count; j++)
		{
			Monitor.Exit(list[j]);
		}
	}

	public void WriteData(int _007B11182_007D, byte[] _007B11183_007D, int _007B11184_007D, bool _007B11185_007D)
	{
		int num = _007B11182_007D / _007B11193_007D;
		int _007B11211_007D = _007B11182_007D % _007B11193_007D;
		_007B11180_007D(num + 1);
		lock (_007B11192_007D[num])
		{
			_007B11191_007D[num].WriteData(_007B11211_007D, _007B11183_007D, _007B11184_007D, _007B11185_007D);
		}
	}

	public void Flush()
	{
		AcquireLock();
		Parallel.For(0, _007B11191_007D.Length, delegate(int _007B11190_007D)
		{
			_007B11191_007D[_007B11190_007D].Flush();
		});
		AcquireUnlock();
	}

	public bool ReadData(int _007B11186_007D, byte[] _007B11187_007D, out int _007B11188_007D)
	{
		int num = _007B11186_007D / _007B11193_007D;
		int _007B11215_007D = _007B11186_007D % _007B11193_007D;
		_007B11188_007D = 0;
		lock (_007B11196_007D)
		{
			if (num >= _007B11197_007D)
			{
				return false;
			}
		}
		lock (_007B11192_007D[num])
		{
			return _007B11191_007D[num].ReadData(_007B11215_007D, _007B11187_007D, out _007B11188_007D);
		}
	}

	[CompilerGenerated]
	private void _007B11189_007D(int _007B11190_007D)
	{
		_007B11191_007D[_007B11190_007D].Flush();
	}
}

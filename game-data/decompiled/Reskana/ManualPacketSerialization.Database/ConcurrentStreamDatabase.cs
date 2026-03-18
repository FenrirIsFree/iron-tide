using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TheraEngine.Collections;

namespace ManualPacketSerialization.Database;

public class ConcurrentStreamDatabase<T, THeaderData> : Database<T> where T : class, ITKSerializable where THeaderData : class, ITKSerializable, new()
{
	private class SequentialPageFile : PageFile
	{
		private bool mainStreamWork;

		public SequentialPageFile(string _007B11115_007D, bool _007B11116_007D)
			: base(_007B11115_007D, _007B11116_007D)
		{
		}

		public void SetPosition(int _007B11117_007D)
		{
			mainStreamWork = true;
			stream.Position = _007B11117_007D;
			if (usingBackupSystem)
			{
				backupFile.Position = _007B11117_007D;
			}
		}

		public void Push(byte[] _007B11118_007D, int _007B11119_007D)
		{
			stream.Write(BitConverter.GetBytes(_007B11119_007D), 0, 4);
			stream.Write(_007B11118_007D, 0, _007B11119_007D);
			stream.Write(ConcurrentStreamDatabase<T, THeaderData>.finishMarker, 0, ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length);
			if (usingBackupSystem)
			{
				backupFile.Write(BitConverter.GetBytes(_007B11119_007D), 0, 4);
				backupFile.Write(_007B11118_007D, 0, _007B11119_007D);
				backupFile.Write(ConcurrentStreamDatabase<T, THeaderData>.finishMarker, 0, ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length);
			}
		}

		public void WriteClipMarker()
		{
			stream.Write(ConcurrentStreamDatabase<T, THeaderData>.clipMarker, 0, ConcurrentStreamDatabase<T, THeaderData>.clipMarker.Length);
			if (usingBackupSystem)
			{
				backupFile.Write(ConcurrentStreamDatabase<T, THeaderData>.clipMarker, 0, ConcurrentStreamDatabase<T, THeaderData>.clipMarker.Length);
			}
		}

		public bool ReadNext(byte[] _007B11120_007D, out int _007B11121_007D)
		{
			long position = stream.Position;
			if (mainStreamWork && TryToReadStream(_007B11120_007D, stream, out _007B11121_007D))
			{
				return true;
			}
			if (usingBackupSystem)
			{
				if (mainStreamWork)
				{
					backupFile.Position = position;
					mainStreamWork = false;
				}
				return TryToReadStream(_007B11120_007D, backupFile, out _007B11121_007D);
			}
			_007B11121_007D = 0;
			return false;
		}

		public void SeekTest(int _007B11122_007D)
		{
			if (stream.Length - stream.Position > _007B11122_007D)
			{
				long length = stream.Position + _007B11122_007D / 4;
				stream.SetLength(length);
				if (usingBackupSystem)
				{
					backupFile.SetLength(length);
				}
			}
		}

		private bool TryToReadStream(byte[] _007B11123_007D, Stream _007B11124_007D, out int _007B11125_007D)
		{
			try
			{
				byte[] array = new byte[4];
				try
				{
					_007B11125_007D = 0;
					if (_007B11124_007D.Read(array, 0, 4) != 4)
					{
						return false;
					}
				}
				catch (Exception)
				{
				}
				_007B11125_007D = BitConverter.ToInt32(array, 0);
				_ = _007B11125_007D;
				_ = 14;
				if (_007B11125_007D == 0)
				{
					return false;
				}
				if (_007B11125_007D != _007B11124_007D.Read(_007B11123_007D, 0, _007B11125_007D))
				{
					return false;
				}
				byte[] array2 = new byte[ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length];
				if (_007B11124_007D.Read(array2, 0, ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length) != ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length)
				{
					return false;
				}
				for (int i = 0; i < ConcurrentStreamDatabase<T, THeaderData>.finishMarker.Length; i++)
				{
					if (array2[i] != ConcurrentStreamDatabase<T, THeaderData>.finishMarker[i])
					{
						return false;
					}
				}
				return true;
			}
			catch
			{
				_007B11125_007D = 0;
				return false;
			}
		}
	}

	private static readonly byte[] finishMarker = new byte[3] { 255, 0, 255 };

	private static readonly byte[] clipMarker = new byte[5];

	private int SeekLimit = 2097152;

	public THeaderData HeaderData = new THeaderData();

	private ConcurrentQueue<BufferedDataHolder> tempBufferPool;

	private int maxObjectSize;

	private SequentialPageFile[] table;

	private int numberOfNodes;

	private string filename;

	private bool usingBackupSystem;

	private int writeConcurrencyLevel;

	private string headerFileName;

	private LinkedDictionrary<int, T> savingQuery;

	private object saveLock = new object();

	public long LastWriteLength { get; private set; }

	public ConcurrentStreamDatabase(int _007B11099_007D, int _007B11100_007D, Func<T, uint> _007B11101_007D, params MPSKeyFieldInformation<T>[] _007B11102_007D)
		: base(_007B11101_007D, _007B11102_007D)
	{
		writeConcurrencyLevel = _007B11100_007D;
		maxObjectSize = _007B11099_007D;
		tempBufferPool = new ConcurrentQueue<BufferedDataHolder>();
		for (int i = 0; i < 8; i++)
		{
			tempBufferPool.Enqueue(new BufferedDataHolder(new byte[_007B11099_007D], 0));
		}
		savingQuery = new LinkedDictionrary<int, T>();
		usingBackupSystem = true;
	}

	public int Deploy(string _007B11103_007D, Action<Exception> _007B11104_007D)
	{
		if (!Directory.Exists("dbName"))
		{
			Directory.CreateDirectory(_007B11103_007D);
		}
		filename = _007B11103_007D + "\\page";
		headerFileName = _007B11103_007D + "\\headerdata";
		if (File.Exists(filename + "_1"))
		{
			string fileNameOnly = Path.GetFileName(filename);
			List<FileInfo> list = (from _007B11127_007D in new DirectoryInfo(Path.GetDirectoryName(filename)).GetFiles()
				where _007B11127_007D.Name.Contains(fileNameOnly) && !_007B11127_007D.Name.Contains("_backup")
				select _007B11127_007D).ToList();
			table = new SequentialPageFile[list.Count];
			for (int num = 0; num < list.Count; num++)
			{
				table[num] = new SequentialPageFile(list[num].FullName, usingBackupSystem);
			}
			numberOfNodes = table.Length;
		}
		else
		{
			table = new SequentialPageFile[0];
			ExpandTo(4);
		}
		bool headerDataLoaded = false;
		Parallel.For(0, table.Length, delegate(int _007B11126_007D)
		{
			table[_007B11126_007D].SetPosition(0);
			if (!tempBufferPool.TryDequeue(out BufferedDataHolder result))
			{
				result = new BufferedDataHolder(new byte[maxObjectSize], 0);
			}
			if (_007B11126_007D == 0 && table[0].ReadNext(result.UsedBuffer, out result.LastOperationBytesCount))
			{
				result.LastOperationBytesCount = 0;
				result.StartIndex = 0;
				try
				{
					HeaderData = DeltaStream.UnboxingTk<THeaderData>(result);
					headerDataLoaded = true;
				}
				catch (Exception obj)
				{
					_007B11104_007D(obj);
				}
			}
			while (table[_007B11126_007D].ReadNext(result.UsedBuffer, out result.LastOperationBytesCount))
			{
				_ = result.LastOperationBytesCount;
				result.LastOperationBytesCount = 0;
				result.StartIndex = 0;
				T val = null;
				try
				{
					val = DeltaStream.UnboxingTk<T>(result);
				}
				catch (Exception obj2)
				{
					_007B11104_007D(obj2);
				}
				if (val != null)
				{
					AddObject(val);
				}
				_ = table[_007B11126_007D].Position;
			}
			tempBufferPool.Enqueue(result);
		});
		int num2 = hotData.Count;
		if (headerDataLoaded)
		{
			num2++;
		}
		return num2;
	}

	public void SaveObjects(Action<Exception> _007B11105_007D)
	{
		lock (saveLock)
		{
			savingQuery.Clear();
			foreach (KeyValuePair<uint, T> hotDatum in hotData)
			{
				long num = hotDatum.Key % writeConcurrencyLevel;
				savingQuery.Add((int)num, hotDatum.Value);
			}
			ExpandTo(writeConcurrencyLevel);
			for (int i = 0; i < table.Length; i++)
			{
				table[i].SetPosition(0);
			}
			Parallel.ForEach(savingQuery.Keys, delegate(int _007B11128_007D)
			{
				if (!tempBufferPool.TryDequeue(out BufferedDataHolder result))
				{
					result = new BufferedDataHolder(new byte[maxObjectSize], 0);
				}
				if (_007B11128_007D == 0)
				{
					result.LastOperationBytesCount = 0;
					result.StartIndex = 0;
					try
					{
						DeltaStream.BoxingTk(HeaderData, result);
						table[_007B11128_007D].Push(result.UsedBuffer, result.LastOperationBytesCount);
						table[_007B11128_007D].Flush();
					}
					catch (Exception obj)
					{
						_007B11105_007D(obj);
					}
				}
				foreach (T item in (IEnumerable<T>)savingQuery[_007B11128_007D])
				{
					result.LastOperationBytesCount = 0;
					result.StartIndex = 0;
					try
					{
						DeltaStream.BoxingTk(item, result);
						table[_007B11128_007D].Push(result.UsedBuffer, result.LastOperationBytesCount);
						table[_007B11128_007D].Flush();
					}
					catch (Exception obj2)
					{
						_007B11105_007D(obj2);
					}
				}
				tempBufferPool.Enqueue(result);
			});
			savingQuery.Clear();
			LastWriteLength = 0L;
			for (int num2 = 0; num2 < table.Length; num2++)
			{
				table[num2].WriteClipMarker();
				table[num2].Flush();
				LastWriteLength += table[num2].Position;
				table[num2].SeekTest(SeekLimit);
			}
		}
	}

	public void AddObject(T _007B11106_007D)
	{
		uint num = getId(_007B11106_007D);
		hotData.TryAdd(num, _007B11106_007D);
		UpdateKeyFields(_007B11106_007D, num);
	}

	public T GetByKeyField(byte _007B11107_007D, object _007B11108_007D)
	{
		if (keyFieldDict[_007B11107_007D].keyTable.TryGetValue(_007B11108_007D, out var value))
		{
			return GetByID(value);
		}
		return null;
	}

	public IEnumerable<T> Enumerate()
	{
		foreach (KeyValuePair<uint, T> hotDatum in hotData)
		{
			yield return hotDatum.Value;
		}
	}

	public void EnumerateParallel(Action<T> _007B11109_007D)
	{
		Parallel.ForEach(hotData, delegate(KeyValuePair<uint, T> _007B11129_007D)
		{
			_007B11109_007D(_007B11129_007D.Value);
		});
	}

	public T GetByID(uint _007B11110_007D)
	{
		if (hotData.TryGetValue(_007B11110_007D, out var value))
		{
			return value;
		}
		return null;
	}

	public void Remove(uint _007B11111_007D)
	{
		hotData.TryRemove(_007B11111_007D, out var _);
	}

	public void Close()
	{
		lock (saveLock)
		{
			SequentialPageFile[] array = table;
			for (int i = 0; i < array.Length; i++)
			{
				array[i].Close();
			}
		}
		CleanCacheInternal();
	}

	public void RemoveAll()
	{
		CleanCacheInternal();
	}

	private void ExpandTo(int _007B11112_007D)
	{
		if (_007B11112_007D > numberOfNodes)
		{
			numberOfNodes = _007B11112_007D;
			int num = table.Length;
			int num2 = _007B11112_007D - table.Length;
			Array.Resize(ref table, _007B11112_007D);
			for (int i = 0; i < num2; i++)
			{
				table[num + i] = new SequentialPageFile(filename + "_" + (num + i + 1), usingBackupSystem);
			}
		}
	}
}

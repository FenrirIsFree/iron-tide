using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using TheraEngine.Collections;

namespace ManualPacketSerialization.Database;

public class MPSaveHolder<T> where T : class, ITKSerializable
{
	private class SequentialPageFile : PageFile
	{
		private bool mainStreamWork;

		public SequentialPageFile(string _007B11158_007D, bool _007B11159_007D)
			: base(_007B11158_007D, _007B11159_007D)
		{
		}

		public void SetPosition(int _007B11160_007D)
		{
			mainStreamWork = true;
			stream.Position = _007B11160_007D;
			if (usingBackupSystem)
			{
				backupFile.Position = _007B11160_007D;
			}
		}

		public void Push(byte[] _007B11161_007D, int _007B11162_007D)
		{
			stream.Write(BitConverter.GetBytes(_007B11162_007D), 0, 4);
			stream.Write(_007B11161_007D, 0, _007B11162_007D);
			stream.Write(MPSaveHolder<T>.finishMarker, 0, MPSaveHolder<T>.finishMarker.Length);
			if (usingBackupSystem)
			{
				backupFile.Write(BitConverter.GetBytes(_007B11162_007D), 0, 4);
				backupFile.Write(_007B11161_007D, 0, _007B11162_007D);
				backupFile.Write(MPSaveHolder<T>.finishMarker, 0, MPSaveHolder<T>.finishMarker.Length);
			}
		}

		public void WriteClipMarker()
		{
			stream.Write(MPSaveHolder<T>.clipMarker, 0, MPSaveHolder<T>.clipMarker.Length);
			if (usingBackupSystem)
			{
				backupFile.Write(MPSaveHolder<T>.clipMarker, 0, MPSaveHolder<T>.clipMarker.Length);
			}
		}

		public bool ReadNext(byte[] _007B11163_007D, out int _007B11164_007D)
		{
			long position = stream.Position;
			if (mainStreamWork && TryToReadStream(_007B11163_007D, stream, out _007B11164_007D))
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
				return TryToReadStream(_007B11163_007D, backupFile, out _007B11164_007D);
			}
			_007B11164_007D = 0;
			return false;
		}

		public void SeekTest(int _007B11165_007D)
		{
			if (stream.Length - stream.Position > _007B11165_007D)
			{
				long length = stream.Position + _007B11165_007D / 4;
				stream.SetLength(length);
				if (usingBackupSystem)
				{
					backupFile.SetLength(length);
				}
			}
		}

		private bool TryToReadStream(byte[] _007B11166_007D, Stream _007B11167_007D, out int _007B11168_007D)
		{
			try
			{
				byte[] array = new byte[4];
				try
				{
					_007B11168_007D = 0;
					if (_007B11167_007D.Read(array, 0, 4) != 4)
					{
						return false;
					}
				}
				catch (Exception)
				{
				}
				_007B11168_007D = BitConverter.ToInt32(array, 0);
				if (_007B11168_007D == 0)
				{
					return false;
				}
				if (_007B11168_007D != _007B11167_007D.Read(_007B11166_007D, 0, _007B11168_007D))
				{
					return false;
				}
				byte[] array2 = new byte[MPSaveHolder<T>.finishMarker.Length];
				if (_007B11167_007D.Read(array2, 0, MPSaveHolder<T>.finishMarker.Length) != MPSaveHolder<T>.finishMarker.Length)
				{
					return false;
				}
				for (int i = 0; i < MPSaveHolder<T>.finishMarker.Length; i++)
				{
					if (array2[i] != MPSaveHolder<T>.finishMarker[i])
					{
						return false;
					}
				}
				return true;
			}
			catch
			{
				_007B11168_007D = 0;
				return false;
			}
		}
	}

	private static readonly byte[] finishMarker = new byte[3] { 255, 0, 255 };

	private static readonly byte[] clipMarker = new byte[5];

	private int SeekLimit = 2097152;

	private const string filename = "node";

	private SequentialPageFile[] table;

	private bool usingBackupSystem;

	private int internalConcurrencyLevel;

	private int maxObjectSize;

	private BufferedDataHolder[] tempBufferPool;

	private object saveLock = new object();

	private bool workInProgress;

	private int finishFlags;

	public long LastWriteLength { get; private set; }

	public MPSaveHolder(string _007B11145_007D, int _007B11146_007D, int _007B11147_007D = 131072)
	{
		internalConcurrencyLevel = _007B11146_007D;
		usingBackupSystem = true;
		maxObjectSize = _007B11147_007D;
		if (!Directory.Exists("dbName"))
		{
			Directory.CreateDirectory(_007B11145_007D);
		}
		table = new SequentialPageFile[_007B11146_007D];
		tempBufferPool = new BufferedDataHolder[_007B11146_007D];
		for (int i = 0; i < _007B11146_007D; i++)
		{
			table[i] = new SequentialPageFile(Path.Combine(_007B11145_007D, "node_" + i), usingBackupSystem);
			tempBufferPool[i] = new BufferedDataHolder(new byte[_007B11147_007D], 0);
		}
	}

	public int Load(Tlist<T> _007B11148_007D, Action<Exception> _007B11149_007D)
	{
		object syncRoot = new object();
		int loadedCount = 0;
		Parallel.For(0, table.Length, delegate(int _007B11169_007D)
		{
			table[_007B11169_007D].SetPosition(0);
			BufferedDataHolder bufferedDataHolder = tempBufferPool[_007B11169_007D];
			while (table[_007B11169_007D].ReadNext(bufferedDataHolder.UsedBuffer, out bufferedDataHolder.LastOperationBytesCount))
			{
				bufferedDataHolder.LastOperationBytesCount = 0;
				bufferedDataHolder.StartIndex = 0;
				T item = null;
				try
				{
					item = DeltaStream.UnboxingTk<T>(bufferedDataHolder);
				}
				catch (Exception obj)
				{
					_007B11149_007D(obj);
				}
				if (item != null)
				{
					lock (syncRoot)
					{
						_007B11148_007D.Add(in item);
						loadedCount++;
					}
				}
				_ = table[_007B11169_007D].Position;
			}
		});
		return loadedCount;
	}

	public void Save(Tlist<T> _007B11150_007D, bool _007B11151_007D, Action<Exception> _007B11152_007D)
	{
		lock (saveLock)
		{
			if (workInProgress)
			{
				return;
			}
			workInProgress = true;
			for (int i = 0; i < table.Length; i++)
			{
				table[i].SetPosition(0);
			}
			if (_007B11151_007D)
			{
				finishFlags = 0;
				int j;
				for (j = 0; j < table.Length; j++)
				{
					ThreadPool.QueueUserWorkItem(delegate
					{
						SingleWorker(_007B11150_007D, j, _007B11152_007D);
						lock (saveLock)
						{
							finishFlags++;
							if (finishFlags == table.Length)
							{
								workInProgress = false;
							}
						}
					});
				}
			}
			else
			{
				Parallel.For(0, table.Length, delegate(int _007B11170_007D)
				{
					SingleWorker(_007B11150_007D, _007B11170_007D, _007B11152_007D);
				});
				workInProgress = false;
			}
		}
	}

	private void SingleWorker(Tlist<T> _007B11153_007D, int _007B11154_007D, Action<Exception> _007B11155_007D)
	{
		int num = _007B11154_007D * _007B11153_007D.Size / internalConcurrencyLevel;
		int num2 = (_007B11154_007D + 1) * _007B11153_007D.Size / internalConcurrencyLevel;
		if (num == num2)
		{
			return;
		}
		SequentialPageFile sequentialPageFile = table[_007B11154_007D];
		BufferedDataHolder bufferedDataHolder = tempBufferPool[_007B11154_007D];
		for (int i = num; i < num2; i++)
		{
			T _007B10887_007D = _007B11153_007D.Array[i];
			bufferedDataHolder.LastOperationBytesCount = 0;
			bufferedDataHolder.StartIndex = 0;
			try
			{
				DeltaStream.BoxingTk(_007B10887_007D, bufferedDataHolder);
				sequentialPageFile.Push(bufferedDataHolder.UsedBuffer, bufferedDataHolder.LastOperationBytesCount);
				sequentialPageFile.Flush();
			}
			catch (Exception obj)
			{
				_007B11155_007D(obj);
			}
		}
		sequentialPageFile.WriteClipMarker();
		sequentialPageFile.Flush();
		LastWriteLength += table[_007B11154_007D].Position;
		sequentialPageFile.SeekTest(SeekLimit);
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
	}
}

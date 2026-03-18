using System;
using System.IO;

namespace ManualPacketSerialization;

public class SimpleSaveHolder<T> where T : class, ITKSerializable
{
	private readonly string folderPath;

	private readonly string fileName;

	private readonly string fileLocation;

	private BufferedDataHolder internalBuffer;

	private volatile bool saveInProgress;

	private readonly object syncRoot = new object();

	public string FileName => fileName;

	public SimpleSaveHolder(string _007B10918_007D, string _007B10919_007D)
	{
		folderPath = _007B10918_007D ?? throw new ArgumentNullException("folderPath");
		fileName = _007B10919_007D ?? throw new ArgumentNullException("fileName");
		fileLocation = Path.Combine(_007B10918_007D, _007B10919_007D);
		internalBuffer = new BufferedDataHolder(new byte[65536], 0);
	}

	public bool TryLoad(out T? _007B10920_007D)
	{
		if (File.Exists(fileLocation))
		{
			_007B10920_007D = DeltaStream.UnboxingFromFileTK<T>(fileLocation);
			long length = new FileInfo(fileLocation).Length;
			GrowCapacity(length);
			return true;
		}
		_007B10920_007D = null;
		return false;
	}

	private void GrowCapacity(long _007B10921_007D)
	{
		if (_007B10921_007D >= internalBuffer.UsedBuffer.Length)
		{
			if (_007B10921_007D > int.MaxValue)
			{
				throw new OutOfMemoryException();
			}
			int newSize = (int)Math.Min(2.1474836E+09f, (float)_007B10921_007D * 1.5f + 524288f);
			Array.Resize(ref internalBuffer.UsedBuffer, newSize);
		}
	}

	public bool TrySave(T _007B10922_007D, out Exception? _007B10923_007D, bool _007B10924_007D = true)
	{
		_007B10923_007D = null;
		lock (syncRoot)
		{
			if (saveInProgress)
			{
				_007B10923_007D = new TimeoutException("Previous save is in progress for " + typeof(T).Name);
				return false;
			}
			saveInProgress = true;
		}
		try
		{
			if (!Directory.Exists(folderPath))
			{
				Directory.CreateDirectory(folderPath);
			}
			int num = 0;
			while (true)
			{
				try
				{
					internalBuffer.StartIndex = 0;
					internalBuffer.LastOperationBytesCount = 0;
					DeltaStream.BoxingTk(_007B10922_007D, internalBuffer);
					DeltaStream.IOPathBuilder(fileLocation);
					DeltaStream.InternalFileWriter(DeltaStream.IOPathBuilder(fileLocation), internalBuffer, _007B10924_007D);
					return true;
				}
				catch (IndexOutOfRangeException)
				{
					GrowCapacity(internalBuffer.UsedBuffer.Length);
				}
				catch (ArgumentException)
				{
					GrowCapacity(internalBuffer.UsedBuffer.Length);
				}
				num++;
			}
		}
		catch (Exception ex3)
		{
			_007B10923_007D = ex3;
			return false;
		}
		finally
		{
			lock (syncRoot)
			{
				saveInProgress = false;
			}
		}
	}
}

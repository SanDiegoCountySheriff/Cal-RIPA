using System;
using System.Collections.Generic;
using System.Text;

namespace RIPA.Functions.Submission.Services.SFTP
{
    public class SftpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string KeyFile { get; set; }
        public string Key { get; set; }
    }
}

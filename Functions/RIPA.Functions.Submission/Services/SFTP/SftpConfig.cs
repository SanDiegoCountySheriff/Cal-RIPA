﻿using System;
using System.Collections.Generic;
using System.Text;

namespace RIPA.Functions.Submission.Services.SFTP
{
    class SftpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}

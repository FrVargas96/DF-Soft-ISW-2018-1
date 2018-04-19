using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using RDotNet;

namespace Proyecto_ISW
{
    public partial class Form1 : Form
    {
        string path;
        string valor_final;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void ingresar_archivo(object sender, EventArgs e)
        {
            OpenFileDialog fDialog = new OpenFileDialog();
            if (fDialog.ShowDialog() != DialogResult.OK) return;

            path = fDialog.FileName.Replace('\\', '/');

            if (path.Substring(path.Length - 3, 3) != "csv")
            {
                MessageBox.Show("Formato Invalido");
                path = "";
            }

        }

        private void calcular_valor(object sender, EventArgs e)
        {
            if (path != "")
            {
                REngine engine = REngine.GetInstance();
                engine.Evaluate("library(datasets)");
                engine.Evaluate("library(m4fe)");
                engine.Evaluate("dataset1 <- read.csv(file = '" + path + "', header = TRUE, sep = ',', stringsAsFactors = FALSE)");
                engine.Evaluate("attach(dataset1)");
                engine.Evaluate("suma <- sum(Adj.Close)");
                engine.Evaluate("prom <- suma / length(Adj.Close)");
                engine.Evaluate("vestor = Adj.Close");
                engine.Evaluate("funci <- function(x){ x <- (x - prom)**2 }");
                engine.Evaluate("vestor <- lapply(vestor, funci)");
                engine.Evaluate("vestor <- simplify2array(vestor)");
                engine.Evaluate("sigma = sum(vestor)");
                engine.Evaluate("sigma = sigma / (length(Adj.Close) - 1)");
                engine.Evaluate("sigma = (sigma)**0.5");
                engine.Evaluate("final <- blackScholes(prom, prom - 1, 1, 5, sigma)");
                CharacterVector final = engine.Evaluate("final").AsCharacter();
                valor_final = final[0].ToString();
                ValorF.Text = valor_final;
            }
            else
            {
                MessageBox.Show("Ingrese un archivo csv");
            }

           // MessageBox.Show("No hago nada aun :D");
        }

        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }
    }
}
